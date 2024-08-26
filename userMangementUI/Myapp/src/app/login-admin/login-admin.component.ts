import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthAdminService } from '../auth-admin.service';

@Component({
  selector: 'app-login-admin',
  templateUrl: './login-admin.component.html',
  styleUrls: ['./login-admin.component.css']
})
export class LoginAdminComponent {
  email: string = '';
  password: string = '';
  stayConnected: boolean = false;
  loginError: string | null = null;
  showPassword: boolean = false; // Added for toggling password visibility

  constructor(private authAdminService: AuthAdminService, private router: Router) {}

  onLogin(): void {
    this.authAdminService.login(this.email, this.password, this.stayConnected).subscribe({
      next: (success) => {
        if (success) {
          this.router.navigate(['/adminpage']); // Redirect to the admin dashboard upon successful login
        } else {
          this.loginError = 'Invalid email or password';
        }
      },
      error: (err) => {
        this.loginError = 'An error occurred during login';
        console.error('Login error', err);
      }
    });
  }

  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }
}
