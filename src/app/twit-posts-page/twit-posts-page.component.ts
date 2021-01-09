import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

twitPostResponseHeaders: string[];
twitPostResponseBody: any

@ViewChild('spinner') spinner: ElementRef;

shouldShowSpinner = false;

  constructor(private _fb: FormBuilder, 
              //private _http: HttpClient,
              private _twitSvc: TwitService) { }

  ngOnInit(): void {
    this.twitForm = this._fb.group({
      userName: this._fb.control('', [Validators.required]),
      content: this._fb.control('', [Validators.required])
    })
  }

  ngAfterViewInit() {
      //this.spinner.nativeElement.style.display = 'none';
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

      this.toggleSpinner()
  }
}
