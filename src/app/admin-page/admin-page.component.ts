import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ActivatedRouteSnapshot, ParamMap, Router, RouterStateSnapshot } from '@angular/router';
import { Subscription, throwError } from 'rxjs';
import { catchError, take } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { ChatMessage, ChatService } from '../chat.service';
import { TwitService } from '../twit.service';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit, AfterViewInit, OnDestroy {

  isLoggedIn: boolean

  //ngOnDestroy() {
  //  this._authSvc.token = this.token
  //}
  
  twitForm: FormGroup = null
  twitUrl: string = null

  twitPostResponseHeaders: string[] = [];
  twitPostResponseBody: any = ''

  @ViewChild('spinner', { static: false }) spinner: ElementRef;

  shouldShowSpinner = false;

  userName = null

  twitsGetResponseHeaders: string[] = []
  twitsGetResponseBody: any = ''

  SERVER_URL = "http://localhost:3000/api/upload";
  uploadForm: FormGroup;

  uploadProfilePicResponseHeaders = []
  uploadProfilePicResponseBody = {} as any

  twitsCount = null

  profileImgSrc = ''
  profileImgHeaders = []
  PROFILE_IMG_SERVER = 'http://localhost:3000/api/profile-pic'

  constructor(private _fb: FormBuilder, 
              private _http: HttpClient,
              private _twitSvc: TwitService,
              private _route: ActivatedRoute,
              private _authSvc: AuthService,
              private router: Router,
              private _chatSvc: ChatService) {
                //this.isLoggedIn = this._authSvc.isLogin()
  }

  ngOnInit(): void {
    //let userName = this._route.snapshot.paramMap.get('userName').toString()
    
    //this.userName = userName

    this.isLoggedIn = this._authSvc.isLogin()

/*
    this._route.paramMap.subscribe( (params: ParamMap) => {
      let userName = params.get('userName')
      this.userName = userName
      console.log('paramMap', this.isLoggedIn)
      //if (this.userName == '') {
      localStorage.set('userName', this.userName)
      //}
      this.getTwits()
    })
*/
    
    this.userName = this._route.snapshot.paramMap.get("userName")
    

    this.form = this._fb.group({
      username: this._fb.control(''),
      message: this._fb.control('')
    })
    
    //console.log(this.userName)

    if (null != this.userName) {
      localStorage.setItem('userName', this.userName)
    }

    if (null == this.userName) {
      this.userName = localStorage.getItem('userName')
    }

    this.getProfilePic()

    //console.log(this.userName) 

    this.twitForm = this._fb.group({
      //userName: this._fb.control('', [Validators.required]),
      content: this._fb.control('', [Validators.required])
    })

    this.uploadForm = this._fb.group({
      profile: ['']
    });

    this.twitsCount = this.getTwitsCount()
    this.getTwits()
  }

  ngAfterViewInit() {
      //this.spinner.nativeElement.style.display = 'none';
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    // check if we are connected before unsubscribing
    if (null != this.event$) {
      this.event$.unsubscribe()
      this.event$ = null
    }
  }

  private getTwits() {
    const params = new HttpParams().set('page','1') //later if hve time do pagination
    const userName = localStorage.getItem('userName')
    this._twitSvc.getTwits(userName, params).subscribe(
      resp => {
        // display its headers
        const keys = resp.headers.keys();
        this.twitsGetResponseHeaders = keys.map(key =>
          `${key}: ${resp.headers.get(key)}`);
  
        // access the body directly, which is typed as `??`.
        this.twitsGetResponseBody = { ...resp.body };
      }
    )
  }


  toggleSpinner() {
    this.shouldShowSpinner = !this.shouldShowSpinner;
    if (!this.shouldShowSpinner) { 
      this.spinner.nativeElement.style.display = 'none'; 
    } else {
      this.spinner.nativeElement.style.display = '';
    }
    
  }

  onSendTwit() {
    this.toggleSpinner()
    const userName = localStorage.getItem('userName')
    const content = this.twitForm.get('content').value
    const params = new HttpParams({fromObject: {userName: userName, content: content}})
    const body = params.toString()
    console.log(content)
    console.log(userName)
    this.showPostTwitResponse(body)
    this.getTwits()
  }

  private showPostTwitResponse(body) {
    
    this._twitSvc.postTwit(body)
      // resp is of type `HttpResponse<any>`
      .subscribe(resp => {
        // display its headers
        const keys = resp.headers.keys();
        this.twitPostResponseHeaders = keys.map(key =>
          `${key}: ${resp.headers.get(key)}`);
  
        // access the body directly, which is typed as `??`.
        this.twitPostResponseBody = { ...resp.body };
      });
      this.twitForm.reset();
      this.toggleSpinner()
  }

  onFileSelect(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.uploadForm.get('profile').setValue(file);
    }
  }

  onUploadProfilePic() {
    const formData = new FormData();
    
    formData.append('avatar', this.uploadForm.get('profile').value);
    formData.append('userName', this.userName);
    //const headers = new HttpHeaders().set('Content-Type', 'multipart/form-data').set('Accept', 'application/json')
    this._http.post<any>(this.SERVER_URL, formData, { observe: 'response' }).pipe(
      take(1),
      catchError(this.handleError)
    ).subscribe( resp => {
        // display its headers
        const keys = resp.headers.keys();
        this.uploadProfilePicResponseHeaders = keys.map( key =>
          `${key}: ${resp.headers.get(key)}`);

        // access the body directly, which is typed as `??`.
        this.uploadProfilePicResponseBody = { ...resp.body };
        //this.toggleSpinner()
        this.profileImgSrc = `https://bkt.sfo2.digitaloceanspaces.com/${this.uploadProfilePicResponseBody.imageName}`
    });
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // Return an observable with a user-facing error message.
    return throwError(
      'Something bad happened; please try again later.');
  }

  /*
  isLogin() {
    const token = localStorage.getItem('token')
    return !!token ? true : false
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.isLogin())
      return true
    return this.router.parseUrl('/error')
  }
  */

  getTwitsCount() {
    //if (this.userName == ) habe time thennd o
    this._twitSvc.getTwitsCount(this.userName).pipe(take(1), catchError(this.handleError)).subscribe( (resp) => {
      this.twitsCount = [ ...resp.body ][0].totalTwits;
      console.log(this.twitsCount)
    })
  }

  text = 'Join'
  form: FormGroup

  messages: ChatMessage[] = []
  event$: Subscription

  sendMessage() {
    const message = this.form.get('message').value
    this.form.get('message').reset()
    console.info('>>> message: ', message)
    this._chatSvc.sendMessage(message)
  }

  toggleConnection() {
    if (this.text == 'Join') {
      this.text = 'Leave'
      const name = localStorage.getItem('userName')//this.form.get('username').value
      this._chatSvc.join(name)
      // subscribe to incoming messages
      this.event$ = this._chatSvc.event.subscribe(
        (chat) => {
          this.messages.unshift(chat)
        }
      )
    } else {
      this.text = 'Join'
      this._chatSvc.leave()
      this.event$.unsubscribe()
      this.event$ = null
    }
  }

  getProfilePic() {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Accept', 'application/json')
      //.set('Authorization' , `Bearer ${this._authSvc.getToken()}`)

    const params = new HttpParams({fromObject: {
      userName: this.userName
    }})
    
    const postBody = params.toString()

    this._http.post<any>(this.PROFILE_IMG_SERVER, postBody, { headers, observe: 'response' }).pipe(
      take(1),
      catchError(this.handleError)
    ).subscribe(resp => {
      // display its headers
      const keys = resp.headers.keys();
      this.profileImgHeaders = keys.map(key =>
        `${key}: ${resp.headers.get(key)}`);

      // access the body directly, which is typed as `??`.
      this.profileImgSrc = `https://bkt.sfo2.digitaloceanspaces.com/${{ ...resp.body }.imageName}`;
    }
      
    )
  }
  

}
