import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.css']
})
export class ErrorPageComponent implements OnInit {

  isLoggedIn

  constructor(
    private _authSvc: AuthService
  ) { }

  ngOnInit(): void {
    this.isLoggedIn = this._authSvc.isLogin()
  }

}
