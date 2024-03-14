import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/shared/common.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
    export class LoginComponent {
  prerequisite() {
    this.createLoginForm();
  }

  ngOnInit() {
    this.prerequisite();
  }

  loginForm: any;

  constructor(
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private router: Router
  ) {}

  createLoginForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', Validators.required],
    });
  }

  submit() {
    if (this.loginForm.valid) {
      const formData = this.loginForm.value;

      this.commonService.login(formData).subscribe({
        next: (response) => {
          console.log(response);

          // const {email:string, user_access_token:string} = response

          const { user_acess_token, email } = response as {
            user_acess_token: string;
            email: string;
          };

          localStorage.setItem('USER_ACCESS_TOKEN', user_acess_token);
          localStorage.setItem('USER_EMAIL', email);
          this.router.navigate(['']);
        },
        error: (error) => {
          window.alert(`${error.error.errorText}`);
        },
      });
    }
  }
}
