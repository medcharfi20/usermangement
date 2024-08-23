import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedRoleService } from '../shared-role.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-role',
  templateUrl: './update-role.component.html',
  styleUrls: ['./update-role.component.css']
})
export class UpdateRoleComponent implements OnInit {
  role: any = {
    name: '',
    description: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private shared: SharedRoleService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const numericId = Number(id);
      this.shared.getRoleById(numericId).subscribe(
        (res: any) => {
          this.role = res;
        },
        (err: any) => {
          console.error('Error fetching role:', err);
        }
      );
    } else {
      console.error('No ID provided in route');
      Swal.fire('Error', 'No ID provided in route', 'error');
    }
  }

  updateRole(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!this.role.name.trim() && !this.role.description.trim()) {
      Swal.fire('Error', 'Name and Description are empty', 'error');
      return;
    } else if (!this.role.name.trim()) {
      Swal.fire('Error', 'Name is empty', 'error');
      return;
    } else if (!this.role.description.trim()) {
      Swal.fire('Error', 'Description is empty', 'error');
      return;
    }

    if (id) {
      const numericId = Number(id);
      this.shared.updateRole(numericId, this.role).subscribe(
        (res: any) => {
          Swal.fire('Success', 'Role updated successfully', 'success').then(() => {
            this.router.navigate(['/role']);  // Navigate back to the role list
          });
        },
        (err: any) => {
          console.error('Error updating role:', err);
          Swal.fire('Error!', 'Name has already exist', 'error');
        }
      );
    } else {
      console.error('No ID provided in route');
      Swal.fire('Error', 'No ID provided in route', 'error');
    }
  }
}