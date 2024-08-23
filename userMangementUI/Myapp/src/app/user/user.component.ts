import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { UserListComponent } from '../user-list/user-list.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  showAddUserForm: boolean = false;  // Controls the visibility of the "Add User" form
  showUserList: boolean = true;  // Controls the visibility of the user list

  // Reference to UserListComponent for reloading the user list when necessary
  @ViewChild(UserListComponent) userListComponent!: UserListComponent;

  constructor(private router: Router) {
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
    this.showList();  // Show the user list by default when the component initializes
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
  }

