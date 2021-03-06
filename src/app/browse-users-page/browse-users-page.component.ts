import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, take } from 'rxjs/operators';

@Component({
  selector: 'app-browse-users-page',
  templateUrl: './browse-users-page.component.html',
  styleUrls: ['./browse-users-page.component.css']
})
export class BrowseUsersPageComponent implements OnInit {

  BROWSE_USERS_SERVER_URL = 'http://localhost:3000/api'

  browseUsersGetResponseBody
  
  constructor(private _http: HttpClient) { }

  ngOnInit(): void {
    this._http.get<any>(this.BROWSE_USERS_SERVER_URL + '/browse-users').pipe(take(1), catchError(this.handleError)).subscribe(
     res => { 
      console.log(res) 
      this.browseUsersGetResponseBody = [ ...res ]; }
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
