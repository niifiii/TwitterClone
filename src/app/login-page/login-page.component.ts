import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  loginForm: FormGroup

  constructor(private _fb: FormBuilder) { }

  ngOnInit(): void {
    this.loginForm = this._fb.group({
      userName: this._fb.control('', [Validators.required]),
      email: this._fb.control('', [Validators.required, Validators.email]),

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



}
