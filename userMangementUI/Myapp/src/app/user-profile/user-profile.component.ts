import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { AuthUserService } from '../auth-user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  userData: any;
  userId: number | null = null;

  constructor(
    private userService: UserService,
    private authUserService: AuthUserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authUserService.getUserId().subscribe(id => {
      if (id !== null) {
        this.userId = id;
        this.loadUserProfile();
      } else {
        this.router.navigate(['/loginuser']); 
      }
    });
  }

  loadUserProfile(): void {
    if (this.userId !== null) {
      this.userService.getUserById(this.userId).subscribe(
        data => {
          this.userData = data;
        },
        error => {
          console.error('Error fetching user data:', error);
          this.router.navigate(['/loginuser']); 
        }
      );
    }
  }

  backToHomePage(): void {
    this.router.navigate(['/home']); // Adjust the path to your home route
  }

  navigateToUpdateProfile(): void {
    if (this.userData && this.userData.id) {
      this.router.navigate([`/updateprofileuser/${this.userData.id}`]);
    }
  }

  logout(): void {
    this.authUserService.logout();
  }
}
