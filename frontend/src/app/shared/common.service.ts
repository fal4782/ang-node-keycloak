import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  signup(data: any) {
    // console.log(data);
    return this.http.post(`${this.baseUrl}/auth/signup`, data);
  }

  login(data: any) {
    // console.log(data);
    return this.http.post(`${this.baseUrl}/auth/login`, data);
  }

  getUsers() {
    return this.http.get(`${this.baseUrl}/users`);
  }

  updatePasswordPolicy(data: any) {
    return this.http.post(`${this.baseUrl}/password-policy`, {
      passwordPolicy: data,
    });
  }

  resetPassword(email: string, password: string) {
    return this.http.post(`${this.baseUrl}/reset-password`, {
      email,
      password,
    });
  }
}
