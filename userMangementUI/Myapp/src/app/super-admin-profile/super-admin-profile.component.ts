import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SuperAdminService } from '../super-admin.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-super-admin-profile',
  templateUrl: './super-admin-profile.component.html',
  styleUrls: ['./super-admin-profile.component.css']
})
export class SuperAdminProfileComponent implements OnInit {
  userData: any;
  userId: number = 1;

  constructor(
    private superAdminService: SuperAdminService,
    private route: ActivatedRoute,
    private authService:AuthService 
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idString = params.get('id');
      if (idString) {
        const parsedId = Number(idString); // Convert string to number using Number constructor
        if (!isNaN(parsedId)) {
          this.userId = parsedId;
          console.log('User ID as number:', this.userId);
          this.fetchUserData();
        } else {
          console.error('Invalid User ID:', idString);
        }
      } else {
        console.error('No user ID found in route');
      }
    });
  }

  fetchUserData() {
    if (this.userId !== null) {
      this.superAdminService.getUserData(this.userId).subscribe(
        data => {
          console.log('User data received:', data);
          this.userData = data;
        },
        error => {
          console.error('Error fetching user data:', error);
        }
      );
    }
  }
  logout() {
    this.authService.logout();
  }
}
