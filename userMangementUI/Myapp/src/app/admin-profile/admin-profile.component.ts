import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../admin.service';
import { AuthAdminService } from '../auth-admin.service';
import { UserListComponent } from '../user-list/user-list.component';

@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.css']
})
export class AdminProfileComponent implements OnInit{
  adminData: any;
  adminId: number | null = null;
  showAddUserForm: boolean = false;  // Controls the visibility of the "Add User" form
  showUserList: boolean = true;
  @ViewChild(UserListComponent) userListComponent!: UserListComponent;
  constructor(
    private route: ActivatedRoute,
    private adminService: AdminService,
    private authAdminService: AuthAdminService,
    private router :Router
  ) {}
  ngOnInit(): void {
    this.showList(); 
    const adminIdString = this.route.snapshot.paramMap.get('id');
    if (adminIdString) {
      const userId = Number(adminIdString); 
      if (!isNaN(userId)) {
        this.adminService.getAdminById(userId).subscribe(
          data => {
            this.adminData = data;
          },
          error => {
            console.error('Error fetching user data:', error);
            this.router.navigate(['/adminpage']);
          }
        );
      } else {
        console.error('Invalid user ID, redirecting to dashboard');
        this.router.navigate(['/adminpage']);
      }
    } else {
      console.error('No user ID found, redirecting to dashboard');
      this.router.navigate(['/adminpage']);
    }
  }

  backToAdminPage(): void {
    this.router.navigate(['/adminpage']);
  }
  navigateToUpdateProfile(): void {
    if (this.adminData && this.adminData.id) {
      this.router.navigate([`/updateprofileadmin/${this.adminData.id}`]);
    }
  }

  logout(): void {
    this.authAdminService.logout();
  }
  showList(): void {
    this.showAddUserForm = false;
    this.showUserList = true;
    if (this.userListComponent) {
      this.userListComponent.loadUsers();  
    }
  }
}
