import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, take } from 'rxjs/operators';

interface ILoginDetails {
  userName: string;
  passwordHash: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  loginServerUrl: string = 'http://localhost:3000/api';

  constructor(private _http: HttpClient) { }

  /** POST: login to the database @ http://localhost:3000/api/post-twit */
  postLogin(body: ILoginDetails): Observable<HttpResponse<any>> {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded').set('Accept', 'application/json')
    return this._http.post<any>(`${this.loginServerUrl}/authentication`, body, { headers, observe: 'response' }).pipe(
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
