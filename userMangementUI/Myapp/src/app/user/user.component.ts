import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { UserListComponent } from '../user-list/user-list.component';
import { filter } from 'rxjs/operators';
import { AdminService } from '../admin.service';
import { AuthAdminService } from '../auth-admin.service'; // Corrected import

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  adminId: number | null = null;

  showAddUserForm: boolean = false;  // Controls the visibility of the "Add User" form
  showUserList: boolean = true;  // Controls the visibility of the user list

  // Reference to UserListComponent for reloading the user list when necessary
  @ViewChild(UserListComponent) userListComponent!: UserListComponent;

  constructor(private router: Router, private adminService: AdminService, private authAdminService: AuthAdminService) { // Fixed constructor parameter
    // Listen to router events to determine when to show the user list
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      if (this.router.url.includes('/users')) {
        this.showList();
      }
    });
  }

  ngOnInit(): void {
    this.showList(); 
    this.authAdminService.getAdminId().subscribe(id => {
      if (id !== null) {
        this.adminService.getAdminById(id).subscribe(admin => {
          this.adminId = admin.id;
        });
      } else {
        console.error('No admin ID found, redirecting to login.');
        this.router.navigate(['/loginadmin']);
      }
    });
  }

  // Method to display the "Add User" form
  showForm(): void {
    this.showAddUserForm = true;
    this.showUserList = false;
  }

  // Method to display the user list and reload the list
  showList(): void {
    this.showAddUserForm = false;
    this.showUserList = true;
    if (this.userListComponent) {
      this.userListComponent.loadUsers();  
    }
  }

  navigateToProfile(): void {
    if (this.adminId !== null) {
      this.router.navigate([`/profileadmin/${this.adminId}`]);
    } else {
      console.error('Admin ID is null. Redirecting to login.');
      this.router.navigate(['/loginadmin']);
    }
  }
}
