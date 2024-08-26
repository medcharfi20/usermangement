import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  stayConnected: boolean = false;
  errorMessage: string = '';
  passwordVisible: boolean = false; // Track password visibility

  constructor(private authService: AuthService, private router: Router) {}

  get passwordType(): string {
    return this.passwordVisible ? 'text' : 'password';
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  login(): void {
    if (!this.email && !this.password) {
      this.errorMessage = 'Email and Password cannot be empty.';
      return;
    } else if (!this.email) {
      this.errorMessage = 'Email cannot be empty.';
      return;
    } else if (!this.password) {
      this.errorMessage = 'Password cannot be empty.';
      return;
    }

    this.authService.login(this.email, this.password, this.stayConnected).subscribe(success => {
      if (success) {
        this.router.navigate(['/superAdmin']);
      } else {
        this.errorMessage = 'Invalid email or password.';
      }
    });
  }
}