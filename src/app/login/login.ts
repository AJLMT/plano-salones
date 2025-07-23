import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  username = '';
  password = '';
  loginError = false; // añadida para controlar el error


  login() {
    if (this.username === 'admin' && this.password === '12345') {
      localStorage.setItem('loggedIn', 'true');
      localStorage.setItem('lastLoginTime', Date.now().toString());
      window.location.href = '/main';
    } else {
      alert('Credenciales incorrectas');
      this.loginError = true;
    }
  }
}
