import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/shared/common.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  prerequisite() {
    this.getUsers();
    this.initPasswordPolicyForm();
  }

  ngOnInit() {
    this.prerequisite();
  }

  users: any[] = [];
  passwordPolicyForm: any;

  constructor(
    private router: Router,
    private commonService: CommonService,
    private formBuilder: FormBuilder
  ) {}

  getUsers() {
    this.commonService.getUsers().subscribe({
      next: (response) => {
        const { data } = response as { data: any };
        for (let i = 0; i < data.length; i++) {
          this.users.push(data[i].username);
        }
      },
      error: (error) => {
        window.alert(`${error.error.message}`);
        this.logout(); //if there is any other error that does create a user but does not allow access to other routes
      },
    });
  }

  initPasswordPolicyForm(): void {
    this.passwordPolicyForm = this.formBuilder.group({
      passwordPolicy: ['length(8)'], // Default policy
    });
  }

  updatePasswordPolicy(): void {
    const selectedPolicy = this.passwordPolicyForm.value.passwordPolicy;

    this.commonService.updatePasswordPolicy(selectedPolicy).subscribe({
      next: (response) => {
        console.log('Password policy updated successfully:', response);
        window.alert('Password policy updated successfully');
      },
      error: (error) => {
        console.error('Error updating password policy:', error);
        window.alert('Error updating password policy');
      },
    });
  }

  resetPassword(){
    this.router.navigate(['/reset-password'])
  }

  logout() {
    localStorage.removeItem('USER_ACCESS_TOKEN');

    // Redirect to the login page cause otherwise will need to reload
    this.router.navigate(['/login']);
  }
}
