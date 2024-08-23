import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { UserService } from '../user.service'; // Ensure this path is correct

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: any[] = []; // Use any[] instead of User[]
  searchControl = new FormControl('');
  filteredOptions: Observable<any[]> = of([]);

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.loadUsers();

    // Subscribe to router events
    this.router.events.pipe(
      startWith(this.router.events),
      map(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      if (this.router.url === '/users') {
        this.loadUsers();
      }
    });

    // Update filtered options on search input change
    this.filteredOptions = this.searchControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    );
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe(
      (res: any[]) => {
        this.users = res;
        this.filteredOptions = this.searchControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value || ''))
        );
      },
      (err) => {
        console.error('Error fetching users:', err);
      }
    );
  }

  private _filter(value: string): any[] {
    const filterValue = value.toLowerCase();
    if (!filterValue) {
      return this.users;
    }
    return this.users.filter(user =>
      (user.nom?.toLowerCase() + ' ' + user.prenom?.toLowerCase()).includes(filterValue)
    );
  }

  deleteUser(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUser(id).subscribe(
          () => {
            Swal.fire('Deleted!', 'The user has been deleted.', 'success');
            this.loadUsers(); // Refresh the list after deletion
          },
          (err) => {
            console.error('Error deleting user:', err);
            Swal.fire('Error!', 'An error occurred while deleting the user.', 'error');
          }
        );
      }
    });
  }

  deleteAllUsers(): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete all!',
      cancelButtonText: 'No, cancel!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteAllUsers().subscribe(
          () => {
            Swal.fire('Deleted!', 'All users have been deleted.', 'success');
            this.loadUsers(); // Refresh the list after deletion
          },
          (err) => {
            console.error('Error deleting all users:', err);
            Swal.fire('Error!', 'An error occurred while deleting all users.', 'error');
          }
        );
      }
    });
  }
}
