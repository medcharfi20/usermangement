import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AdminService } from '../admin.service';
import Swal from 'sweetalert2';
import { Observable, of } from 'rxjs';
import { switchMap, startWith, catchError, map } from 'rxjs/operators';

// Define the Admin interface
export interface Admin {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  numeroTelephone: string;
  photo?: string;
  role?: {
    name?: string;
    description?: string;
  };
}

@Component({
  selector: 'app-admin-list',
  templateUrl: './admin-list.component.html',
  styleUrls: ['./admin-list.component.css']
})
export class AdminListComponent implements OnInit {
  searchControl = new FormControl('');
  filteredOptions$: Observable<Admin[]> = of([]);
  admins: Admin[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadAdmins();
  }

  public loadAdmins(): void {
    this.adminService.getAllAdmins().subscribe(
      (admins: Admin[]) => {
        this.admins = admins;
        this.filteredOptions$ = this.searchControl.valueChanges.pipe(
          startWith(''),
          map(value => (value || '').trim().toLowerCase()), // Handle null case
          switchMap(searchTerm => {
            return of(this.admins.filter(admin =>
              (admin.nom + ' ' + admin.prenom).toLowerCase().includes(searchTerm)
            ));
          }),
          catchError(err => {
            console.error('Error filtering admins:', err);
            return of([]);
          })
        );
      },
      err => this.handleLoadError('admins', err)
    );
  }

  deleteAllAdmins(): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will delete all admins!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete all!'
    }).then(result => {
      if (result.isConfirmed) {
        this.adminService.deleteAllAdmins().subscribe(
          () => {
            Swal.fire('Deleted!', 'All admins have been deleted.', 'success');
            this.searchControl.setValue('');
            this.loadAdmins();
          },
          err => this.handleLoadError('delete all admins', err)
        );
      }
    });
  }

  deleteAdmin(adminId: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will delete the admin!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(result => {
      if (result.isConfirmed) {
        this.adminService.deleteAdmin(adminId).subscribe(
          () => {
            Swal.fire('Deleted!', 'Admin has been deleted.', 'success');
            this.searchControl.setValue('');
            this.loadAdmins();
          },
          err => this.handleLoadError('delete admin', err)
        );
      }
    });
  }

  private handleLoadError(context: string, error: any): void {
    console.error(`Error loading ${context}:`, error);
    Swal.fire('Error!', `Failed to load ${context}. Please try again later.`, 'error');
  }
}