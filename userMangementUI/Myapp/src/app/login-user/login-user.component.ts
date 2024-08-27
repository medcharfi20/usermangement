import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthUserService } from '../auth-user.service'; // Adjust the path if necessary

@Component({
  selector: 'app-login-user',
  templateUrl: './login-user.component.html',
  styleUrls: ['./login-user.component.css']
})
export class LoginUserComponent implements OnInit {
  loginForm: FormGroup;
  loginError: string | null = null;
  showPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authUserService: AuthUserService,
    private router: Router
  ) {
    // Initialize the form with validation
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      stayConnected: [false]
    });
  }

  ngOnInit(): void {}

  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    const { email, password, stayConnected } = this.loginForm.value;

    this.authUserService.login(email, password, stayConnected).subscribe({
      next: (response) => {
        if (response.success) {
          // Redirect to the user profile page
          this.router.navigate([`/profileuser/${response.userId}`]);
        } else {
          
          this.loginError = response.message ?? null; 
        }
      },
      error: (error: any) => {
        this.loginError = 'An unexpected error occurred during login';
        console.error('Login error', error);
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
