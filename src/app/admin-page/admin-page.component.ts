import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit {

  isLoggedIn: boolean

  constructor(
    private _authSvc: AuthService
  ) { }

  ngOnInit(): void {
    this.isLoggedIn = this._authSvc.isLogin()
  }

  //ngOnDestroy() {
  //  this._authSvc.token = this.token
  //}

}
