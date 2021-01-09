import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, take } from 'rxjs/operators';

export interface ITwit {
  userName: string;
  content: string;
}

@Injectable({
  providedIn: 'root'
})
export class TwitService {

  twitsServerUrl: string = 'localhost:3000/api';

  constructor(private _http: HttpClient) { }

  /** POST: add a new twit to the database @ http://localhost:3000/api/post-twit */
  postTwit(body: any): Observable<HttpResponse<any>> {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded').set('Accept', 'application/json')
    return this._http.post<ITwit>(`${this.twitsServerUrl}/post-twit`, body, { headers, observe: 'response' }).pipe(
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