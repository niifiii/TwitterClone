import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  newsServerUrl = 'http://localhost:3000/api' 

  constructor(private _http: HttpClient,
    ) { }

  getNews() { //params
    return this._http.get<any>(`${this.newsServerUrl}/news`,{/* params: params, */observe: 'response' }).pipe(
      take(1),
      catchError(this.handleError)
    )
  }

  getNewsWithQueryString(numberOfArticles) {

    numberOfArticles
    const params = new HttpParams().set('numberOfArticles', numberOfArticles);

    return this._http.get<any>(`${this.newsServerUrl}/news`,{ params: params, observe: 'response' }).pipe(
      take(1),
      catchError(this.handleError)
    )
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
