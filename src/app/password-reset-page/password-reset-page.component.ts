import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-password-reset-page',
  templateUrl: './password-reset-page.component.html',
  styleUrls: ['./password-reset-page.component.css']
})
export class PasswordResetPageComponent implements OnInit {

  passwordResetForm: FormGroup

  constructor(private _fb: FormBuilder) { }

  ngOnInit(): void {
  

      this.passwordResetForm = this._fb.group({
        email: this._fb.control('', [Validators.required, Validators.email]),

      })
  }

  onResetPassword() {
    
  }

  getErrorMessageEmail() {
    if (this.passwordResetForm.get('email').hasError('required')) {
      return 'You must enter a value';
    }

    return this.passwordResetForm.get('email').hasError('email') ? 'Not a valid email' : '';
  }

}
