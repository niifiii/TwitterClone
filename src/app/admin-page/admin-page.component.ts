import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ActivatedRouteSnapshot, ParamMap, Router, RouterStateSnapshot } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError, take } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { TwitService } from '../twit.service';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit, AfterViewInit {

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

  userName = ''

  twitsGetResponseHeaders: string[] = []
  twitsGetResponseBody: any = ''

  SERVER_URL = "http://localhost:3000/api/upload";
  uploadForm: FormGroup;

  uploadProfilePicResponseHeaders = []
  uploadProfilePicResponseBody = {} as any

  profileImgSrc = ''

  constructor(private _fb: FormBuilder, 
              private _http: HttpClient,
              private _twitSvc: TwitService,
              private _route: ActivatedRoute,
              private _authSvc: AuthService,
              private router: Router) {
                //this.isLoggedIn = this._authSvc.isLogin()
  }

  ngOnInit(): void {
    //let userName = this._route.snapshot.paramMap.get('userName').toString()
    
    //this.userName = userName

    this.isLoggedIn = this._authSvc.isLogin()

    this._route.paramMap.subscribe( (params: ParamMap) => {
      let userName = params.get('userName')
      this.userName = userName

      console.log(this.isLoggedIn)
    })


    console.log(this.userName) 

    this.twitForm = this._fb.group({
      userName: this._fb.control('', [Validators.required]),
      content: this._fb.control('', [Validators.required])
    })

    this.uploadForm = this._fb.group({
      profile: ['']
    });

    this.getTwits();
  }

  ngAfterViewInit() {
      //this.spinner.nativeElement.style.display = 'none';
  }

  private getTwits() {
    const params = new HttpParams().set('page','1') //later if hve time do pagination
    this._twitSvc.getTwits(this.userName, params).subscribe(
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
    const userName = this.twitForm.get('userName').value
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
}
