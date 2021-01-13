import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ActivatedRouteSnapshot, ParamMap, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { TwitService } from '../twit.service';

@Component({
  selector: 'app-twit-posts-page',
  templateUrl: './twit-posts-page.component.html',
  styleUrls: ['./twit-posts-page.component.css']
})
export class TwitPostsPageComponent implements OnInit, AfterViewInit {

  twitForm: FormGroup = null
  twitUrl: string = null

  twitPostResponseHeaders: string[] = [];
  twitPostResponseBody: any = ''

  @ViewChild('spinner', { static: false }) spinner: ElementRef;

  shouldShowSpinner = false;

  userName = ''

  twitsGetResponseHeaders: string[] = []
  twitsGetResponseBody: any = ''

  constructor(private _fb: FormBuilder, 
              //private _http: HttpClient,
              private _twitSvc: TwitService,
              private _route: ActivatedRoute,
              private router:Router) { }

  ngOnInit(): void {
    //let userName = this._route.snapshot.paramMap.get('userName').toString()
    
    //this.userName = userName

    this._route.paramMap.subscribe( (params: ParamMap) => {
      let userName = params.get('userName')
      this.userName = userName
    })
    
    console.log(this.userName) 

    this.twitForm = this._fb.group({
      userName: this._fb.control('', [Validators.required]),
      content: this._fb.control('', [Validators.required])
    })

    this.getTwits();
  }

  ngAfterViewInit() {
      //this.spinner.nativeElement.style.display = 'none';
  }

  private getTwits() {
    const params = new HttpParams().set('page','1')
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
