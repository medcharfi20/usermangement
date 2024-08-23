import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedRoleService } from '../shared-role.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.css']
})
export class AddRoleComponent implements OnInit {
  roleForm!: FormGroup;  // Non-null assertion operator used here

  constructor(
    private fb: FormBuilder,
    private shared: SharedRoleService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.roleForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  createRole(): void {
    if (this.roleForm.invalid) {
      const nameControl = this.roleForm.controls['name'];
      const descriptionControl = this.roleForm.controls['description'];

      let errorMessage = 'Error: ';
      if (nameControl.hasError('required') && descriptionControl.hasError('required')) {
        errorMessage += 'Both Name and Description are required';
      } else if (nameControl.hasError('required')) {
        errorMessage += 'Name is required';
      } else if (descriptionControl.hasError('required')) {
        errorMessage += 'Description is required';
      }

      Swal.fire('Error', errorMessage, 'error');
      return;
    }

    this.shared.createRole(this.roleForm.value).subscribe(
      (res: any) => {
        Swal.fire('Success', 'Role created successfully', 'success');
        this.router.navigate(['/role']);
        this.roleForm.reset();
      },
      (err: any) => {
        if (err === 'Role name already exists') {
          Swal.fire('Error!', 'Role name already exists', 'error');
        } else {
          Swal.fire('Error!', 'An error occurred while creating the role', 'error');
        }
      }
    );
  }
}
