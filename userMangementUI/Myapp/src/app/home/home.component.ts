import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(private authService: AuthService, private router: Router) {}

  navigateToSuperAdmin(): void {
    this.authService.isLoggedIn().subscribe(loggedIn => {
      if (loggedIn) {
        this.router.navigate(['/superAdmin']);
      } else {
        this.router.navigate(['/login']); // Redirect to login if not logged in
      }
    });
  }
  
}
