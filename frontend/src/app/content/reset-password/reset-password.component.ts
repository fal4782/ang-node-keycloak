import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/shared/common.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent {
  prerequisite() {
    this.createResetPasswordForm();
  }

  ngOnInit() {
    this.prerequisite();
  }

  resetPasswordForm: any;

  constructor(
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private router: Router
  ) {}

  createResetPasswordForm() {
    this.resetPasswordForm = this.formBuilder.group({
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  submit() {
    if (this.resetPasswordForm.valid) {
      const password = this.resetPasswordForm.value.confirmPassword;
      const email = localStorage.getItem('USER_EMAIL') || '';

      //   Call the resetPassword method from CommonService to handle the API call
      this.commonService.resetPassword(email, password).subscribe({
        next: (response) => {
          console.log(response);
          localStorage.clear()
          this.router.navigate(['/login'])
        },
        error: (error) => {
          window.alert(`${error.error.message}`);
          console.log(error.error.message);
        },
      });
    }
  }
}
