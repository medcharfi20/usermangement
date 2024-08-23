import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { SharedRoleService } from '../shared-role.service';

interface Role {
  id: number;
  name: string;
  description: string;
}

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.css']
})
export class RoleListComponent implements OnInit {
  roles: Role[] = [];
  searchControl: FormControl = new FormControl('');
  filteredRoles: Role[] = [];

  constructor(private sharedRoleService: SharedRoleService) {}

  ngOnInit(): void {
    this.loadRoles();

    // Subscribe to search input changes
    this.searchControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    ).subscribe(filteredRoles => {
      this.filteredRoles = filteredRoles;
    });
  }

  loadRoles(): void {
    this.sharedRoleService.getAll().subscribe(
      (res: Role[]) => {
        this.roles = res || [];
        this.filteredRoles = this.roles; // Initialize filtered roles
      },
      (err: any) => {
        console.error('Error fetching roles:', err);
      }
    );
  }

  delete(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this role!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.sharedRoleService.deleteRole(id).subscribe(
          () => {
            Swal.fire('Deleted!', 'The role has been deleted.', 'success');
            this.loadRoles(); // Reload roles after deletion
          },
          (err: any) => {
            console.error('Error deleting role:', err);
            Swal.fire('Error!', 'An error occurred while deleting the role.', 'error');
          }
        );
      }
    });
  }

  deleteAll(): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will delete all roles!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete all!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.sharedRoleService.deleteAllRoles().subscribe(
          () => {
            Swal.fire('Deleted!', 'All roles have been deleted.', 'success');
            this.loadRoles(); // Reload roles after deleting all
          },
          (err: any) => {
            console.error('Error deleting all roles:', err);
            Swal.fire('Error!', 'An error occurred while deleting all roles.', 'error');
          }
        );
      }
    });
  }

  private _filter(value: string): Role[] {
    const filterValue = value.toLowerCase();
    return this.roles.filter(role => role.name.toLowerCase().includes(filterValue));
  }
}