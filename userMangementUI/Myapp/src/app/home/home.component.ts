import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { AuthAdminService } from '../auth-admin.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(private authService: AuthService,private authAdminService:AuthAdminService ,private router: Router) {}

  navigateToSuperAdmin(): void {
    this.authService.isLoggedIn().subscribe(loggedIn => {
      if (loggedIn) {
        this.router.navigate(['/superAdmin']);
      } else {
        this.router.navigate(['/login']); // Redirect to login if not logged in
      }
    });
  }
  navigateToAdmin(): void {
    this.authAdminService.isLoggedIn().subscribe(loggedIn => {
      if (loggedIn) {
        this.router.navigate(['/adminpage']);
      } else {
        this.router.navigate(['/loginadmin']); // Redirect to login if not logged in
      }
    });
  }
  
}