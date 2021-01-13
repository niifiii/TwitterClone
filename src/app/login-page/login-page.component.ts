import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  loginForm: FormGroup

  constructor(private _fb: FormBuilder, private _authSvc: AuthService, private _router: Router) { }

  ngOnInit(): void {
    this.loginForm = this._fb.group({
      userName: this._fb.control('', [Validators.required]),
      //email: this._fb.control('', [Validators.required, Validators.email]),
      password: this._fb.control("", [Validators.required])
    })
  }

  getErrorMessageEmail() {
    if (this.loginForm.get('email').hasError('required')) {
      return 'You must enter a value';
    }

    return this.loginForm.get('email').hasError('email') ? 'Not a valid email' : '';
  }

  getErrorMessageUserName() {
    if (this.loginForm.get('userName').hasError('required')) {
      return 'You must enter a value';
    }
    return 
  }

  getErrorMessagePassword() {
    if (this.loginForm.get('password').hasError('required')) {
      return 'You must enter a value';
    }
    return 
  }

  performLogin() {
    console.info('>>> values: ', this.loginForm.value)
    this._authSvc.login(this.loginForm.get('userName').value, this.loginForm.get('password').value)
      .then(result => {
        console.info('>>> result: ', result)
        this._router.navigate([ '/admin', this.loginForm.get('userName').value ])
      })
	}

  isLogin() {
    const token = localStorage.getItem('token')
    return !!token ? true : false
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.isLogin())
      return false
    return this._router.parseUrl('/error')
  }

}
