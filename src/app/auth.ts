import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly USER = 'admin';
  private readonly PASSWORD = '1234';
  private isLoggedIn = false;

  constructor(private router: Router) { }

  login(user: string, pass: string): boolean {
    if (user === this.USER && pass === this.PASSWORD) {
      this.isLoggedIn = true;
      this.router.navigate(['/main']);
      return true;
    }
    return false;
  }

  logout() {
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }

  get isAuthenticated(): boolean {
    return this.isLoggedIn;
  }
}
