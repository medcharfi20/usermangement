import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AdminListComponent } from '../admin-list/admin-list.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  showAddAdminForm: boolean = false;
  showAdminList: boolean = true;
  userId: number | null = 1;

  // Reference to AdminListComponent
  @ViewChild(AdminListComponent) adminListComponent!: AdminListComponent;

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      if (this.router.url.includes('/admin')) {
        this.showList();
      }
    });
  }

  ngOnInit(): void {
    this.showList(); 
  }

  showForm(): void {
    this.showAddAdminForm = true;
    this.showAdminList = false;
  }

  showList(): void {
    this.showAddAdminForm = false;
    this.showAdminList = true;
    if (this.adminListComponent) {
      this.adminListComponent.loadAdmins();  // Reload the admin list
    }
  }
}
