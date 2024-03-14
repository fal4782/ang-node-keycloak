import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './content/signup/signup.component';
import { LoginComponent } from './content/login/login.component';
import { HomeComponent } from './content/home/home.component';
import { AuthGuard } from './shared/auth-guard.service';
import { ResetPasswordComponent } from './content/reset-password/reset-password.component'; // Import the ResetPasswordComponent

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
