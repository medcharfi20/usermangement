import { Component, OnInit } from '@angular/core';
import { AuthAdminService } from '../auth-admin.service';
import { Router } from '@angular/router';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit {
  adminId: number | null = null;

  constructor(
    private authAdminService: AuthAdminService,
    private router: Router,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
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

  navigateToProfile(): void {
    if (this.adminId !== null) {
      this.router.navigate([`/profileadmin/${this.adminId}`]);
    } else {
      console.error('Admin ID is null. Redirecting to login.');
      this.router.navigate(['/loginadmin']);
    }
  }

  
}
