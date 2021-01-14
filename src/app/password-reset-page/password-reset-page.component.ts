import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { throwError } from 'rxjs';
import { catchError, take } from 'rxjs/operators';

@Component({
  selector: 'app-password-reset-page',
  templateUrl: './password-reset-page.component.html',
  styleUrls: ['./password-reset-page.component.css']
})
export class PasswordResetPageComponent implements OnInit {

  passwordResetForm: FormGroup

  RESET_PASSWORD_SERVER = 'http://localhost:3000/api'

  resetPasswordPostResponseHeaders

  resetPasswordPostResponseBody

  constructor(private _fb: FormBuilder, private _http: HttpClient) { }

  ngOnInit(): void {

      this.passwordResetForm = this._fb.group({
        email: this._fb.control('', [Validators.required, Validators.email]),

      })
  }

  onResetPassword() {
    const resetPasswordForEmail = this.passwordResetForm.get('email')

    //this._http.post(RESET_PASSWORD_SERVER, body, {});

    const params = new HttpParams({fromObject: {

      emailAddress: this.passwordResetForm.get('email').value

    }})
    const postBody = params.toString()
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded').set('Accept', 'application/json')
    this._http.post<any>(`${this.RESET_PASSWORD_SERVER}/reset-password`, postBody, { headers, observe: 'response' }).pipe(
        take(1),
        catchError(this.handleError)
      ).subscribe( resp => {
          // display its headers
          const keys = resp.headers.keys();
          this.resetPasswordPostResponseHeaders = keys.map(key =>
            `${key}: ${resp.headers.get(key)}`);
    
          // access the body directly, which is typed as `??`.
          this.resetPasswordPostResponseBody = { ...resp.body };
        });
  }

  getErrorMessageEmail() {
    if (this.passwordResetForm.get('email').hasError('required')) {
      return 'You must enter a value';
    }

    return this.passwordResetForm.get('email').hasError('email') ? 'Not a valid email' : '';
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

}
