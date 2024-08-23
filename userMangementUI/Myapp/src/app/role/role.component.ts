import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { SharedRoleService } from '../shared-role.service';
import { filter } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit {
  showAddRoleForm: boolean = false;
  showRoleList: boolean = true;
  roles: any[] = [];
   userId: number | null = 1;  
  role: any; // Assuming you are fetching a single role

  constructor(
    private sharedRoleService: SharedRoleService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Subscribe to router events to update view based on URL
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      if (this.router.url.includes('/role')) {
        this.showList();
      }
    });
  }

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam !== null) {
      const numericId = Number(idParam);
      if (!isNaN(numericId)) {
        this.userId = numericId;
        console.log('User ID from snapshot:', this.userId);
        this.fetchRoleById(this.userId);
      } else {
        console.error('Invalid ID format:', idParam);
      }
    } else {
      console.error('No ID provided in route');
    }
    this.showList();
  }

  showForm() {
    this.showAddRoleForm = true;
    this.showRoleList = false;
  }

  showList() {
    this.showAddRoleForm = false; 
    this.showRoleList = true;
    this.fetchRoles();
  }

  fetchRoles() {
    this.sharedRoleService.getAll().subscribe(
      (roles) => {
        this.roles = roles;
        console.log('Roles fetched:', roles);
      },
      (error) => {
        console.error('Error fetching roles:', error);
      }
    );
  }

  fetchRoleById(id: number) {
    this.sharedRoleService.getRoleById(id).subscribe(
      (res: any) => {
        this.role = res;
        console.log('Role fetched:', res);
      },
      (err: any) => {
        console.error('Error fetching role:', err);
      }
    );
  }
}
