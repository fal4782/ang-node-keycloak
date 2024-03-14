// auth-guard.service.ts

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const userAccessToken = localStorage.getItem('USER_ACCESS_TOKEN');

    if (userAccessToken) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
