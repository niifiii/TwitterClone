import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'TwitterClone';

  //isLoggedIn = false

  constructor(private _auth: AuthService, private _router: Router) {
  }

  onLogout() {
    localStorage.clear();
    this._router.navigate([ 'landing' ])
  }
}
