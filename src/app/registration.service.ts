import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { stringify } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, take } from 'rxjs/operators';

interface IRegistrationDetails {
  userName: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  registrationServerUrl: string = 'http://localhost:3000/api';

  constructor(private _http: HttpClient) { }

  /** POST: add a new twit to the database @ http://localhost:3000/api/post-twit */
  postRegistrationDetails(body: IRegistrationDetails): Observable<HttpResponse<any>> {
    const params = new HttpParams({fromObject: {
      userName: body.userName,
      email: body.email,
      password: body.password
    }})
    const postBody = params.toString()
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded').set('Accept', 'application/json')
    return this._http.post<any>(`${this.registrationServerUrl}/register`, postBody, { headers, observe: 'response' }).pipe(
        take(1),
        catchError(this.handleError)
      );
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
