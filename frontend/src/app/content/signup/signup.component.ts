import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/shared/common.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  prerequisite() {
    this.createSignupForm();
  }

  ngOnInit() {
    this.prerequisite();
  }

  signupForm: any;
  isFirstLogIn = 'false';

  constructor(
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private router: Router
  ) {}

  createSignupForm() {
    this.signupForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      password: ['', Validators.required],
    });
  }

  submit() {
    if (this.signupForm.valid) {
      const formData = this.signupForm.value;

      this.commonService.signup(formData).subscribe({
        next: (response) => {
          // console.log(response);

          const { user_acess_token, user } = response as {
            user_acess_token: string;
            user: {};
          };
          const { email } = user as { email: string };

          localStorage.setItem('USER_ACCESS_TOKEN', user_acess_token);
          localStorage.setItem('USER_EMAIL', email);
          localStorage.setItem('FIRST_LOGIN', this.isFirstLogIn);
          this.router.navigate(['']);
        },
        error: (error) => {
          console.log(error.error.error);
          window.alert(`${error.error.error}`);
        },
      });
    }
  }
}
