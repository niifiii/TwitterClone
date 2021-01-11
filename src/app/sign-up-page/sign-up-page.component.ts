import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RegistrationService } from '../registration.service';

import * as bcrypt from 'bcryptjs';
import { Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-sign-up-page',
  templateUrl: './sign-up-page.component.html',
  styleUrls: ['./sign-up-page.component.css']
})
export class SignUpPageComponent implements OnInit {
  
  signupForm: FormGroup
  hide = true;

  registrationPostResponseHeaders: string[]  = []
  registrationPostResponseBody: any = {}

  
  constructor(private _fb: FormBuilder, private _registrationSvc: RegistrationService, private _router: Router) { }

  ngOnInit(): void {
    this.signupForm = this._fb.group({
      userName: this._fb.control('', [Validators.required]),
      email: this._fb.control('', [Validators.required, Validators.email]),
      password: this._fb.control('', [Validators.required]),
      confirmPassword: this._fb.control('', [Validators.required])
    })
  }

  async onSubmit() {
    /* HASH : if have time*/
    //const salt = bcrypt.genSaltSync(10);
    //const passwordHash = bcrypt.hashSync(this.signupForm.get('password').value, salt);
    
    //const postBody = {
    //  userName: '',
    //  email: '',
    //  passwordHash: passwordHash,
    //  passwordSalt: salt
    //}

    //console.log(JSON.stringify(postBody));

    const userName = this.signupForm.get('userName').value;
    const email = this.signupForm.get('email').value;
    const password = this.signupForm.get('password').value;

    const postBody = {
      userName: userName,
      email: email,
      password: password
    }

    await this._registrationSvc.postRegistrationDetails(postBody).subscribe(
      resp => {
        // display its headers
        const keys = resp.headers.keys();
        this.registrationPostResponseHeaders = keys.map(key =>
          `${key}: ${resp.headers.get(key)}`);
  
        // access the body directly, which is typed as `??`.
        this.registrationPostResponseBody = { ...resp.body };

        if (this.registrationPostResponseBody.message === 'ok') {
          this._router.navigate(['/registered'])
        }

      }
    )
  }

  getErrorMessageEmail() {
    if (this.signupForm.get('email').hasError('required')) {
      return 'You must enter a value';
    }

    return this.signupForm.get('email').hasError('email') ? 'Not a valid email' : '';
  }

  getErrorMessageUserName() {
    if (this.signupForm.get('userName').hasError('required')) {
      return 'You must enter a value';
    }

    return 
  }
}
