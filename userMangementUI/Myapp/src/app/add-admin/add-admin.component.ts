import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../admin.service';
import { SharedRoleService } from '../shared-role.service'; // Import the SharedRoleService
import Swal from 'sweetalert2';

// Custom validators
function emailFormatValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const email = control.value || '';
    if (email === '') {
      return null;
    }
    const hasAt = email.includes('@');
    const hasDot = email.includes('.');
    if (!hasAt && !hasDot) {
      return { emailFormat: 'missingBoth' };
    }
    if (!hasAt) {
      return { emailFormat: 'missingAt' };
    }
    if (!hasDot) {
      return { emailFormat: 'missingDot' };
    }
    return null;
  };
}

function phoneNumberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const phoneNumber = control.value || '';
    const isNumeric = /^\d+$/.test(phoneNumber);
    const hasValidLength = phoneNumber.length === 8;
    if (!isNumeric && !hasValidLength) {
      return { phoneNumber: 'notNumericAndInvalidLength' };
    }
    if (!isNumeric) {
      return { phoneNumber: 'notNumeric' };
    }
    if (!hasValidLength) {
      return { phoneNumber: 'invalidLength' };
    }
    return null;
  };
}

@Component({
  selector: 'app-add-admin',
  templateUrl: './add-admin.component.html',
  styleUrls: ['./add-admin.component.css']
})
export class AddAdminComponent implements OnInit {
  adminForm: FormGroup;
  selectedFile: File | null = null;
  passwordVisible = false;
  roles: any[] = [];

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private sharedRoleService: SharedRoleService, // Inject SharedRoleService
    private router: Router
  ) {
    this.adminForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, emailFormatValidator()]],
      password: ['', Validators.required],
      dateDeNaissance: ['', Validators.required],
      numeroTelephone: ['', [Validators.required, phoneNumberValidator()]],
      role: ['', Validators.required],
      profilePicture: [null]
    });
  }

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.sharedRoleService.getAll().subscribe({
      next: (roles) => {
        this.roles = roles;
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load roles.',
          confirmButtonText: 'OK'
        });
      }
    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files.length > 0 ? event.target.files[0] : null;
    // Mark file control as touched
    this.adminForm.get('profilePicture')?.markAsTouched();
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  onSubmit(): void {
    // Trigger validation for all controls
    this.adminForm.markAllAsTouched();

    if (this.adminForm.invalid || !this.selectedFile) {
      this.triggerValidationAlert();
      return;
    }

    const adminData = this.adminForm.value;
    adminData.roleId = adminData.role; // Adjust role data to match backend requirements

    this.adminService.createAdmin(adminData, this.selectedFile).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Admin Added',
          text: 'The admin has been added successfully!',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/admin']); 
        });
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Email already exist.',
          confirmButtonText: 'OK'
        });
      }
    });
  }

  triggerValidationAlert() {
    let validationErrors: string[] = [];

    if (this.adminForm.get('nom')?.hasError('required')) {
      validationErrors.push('Last Name cannot be empty.');
    }
    if (this.adminForm.get('prenom')?.hasError('required')) {
      validationErrors.push('First Name  cannot be empty.');
    }
    if (this.adminForm.get('email')?.hasError('required')) {
      validationErrors.push('Email cannot be empty.');
    }
    if (this.adminForm.get('email')?.hasError('emailFormat')) {
      const errorType = this.adminForm.get('email')?.errors?.['emailFormat'];
      if (errorType === 'missingBoth') {
        validationErrors.push('Email address is missing both "@" and ".".');
      } else if (errorType === 'missingAt') {
        validationErrors.push('Email address is missing "@" symbol.');
      } else if (errorType === 'missingDot') {
        validationErrors.push('Email address is missing "." symbol.');
      }
    }
    if (this.adminForm.get('numeroTelephone')?.hasError('required')) {
      validationErrors.push('Phone Number  cannot be empty.');
    }
    if (this.adminForm.get('numeroTelephone')?.hasError('phoneNumber')) {
      const errorType = this.adminForm.get('numeroTelephone')?.errors?.['phoneNumber'];
      if (errorType === 'notNumeric') {
        validationErrors.push('Phone Number must be numeric.');
      } else if (errorType === 'invalidLength') {
        validationErrors.push('Phone Number must be 8 digits.');
      } else if (errorType === 'notNumericAndInvalidLength') {
        validationErrors.push('Phone Number must be numeric and 8 digits.');
      }
    }
    if (this.adminForm.get('password')?.hasError('required')) {
      validationErrors.push('Password cannot be empty.');
    }
    if (this.adminForm.get('dateDeNaissance')?.hasError('required')) {
      validationErrors.push('Date of Birth cannot be empty.');
    }
    if (this.adminForm.get('role')?.hasError('required')) {
      validationErrors.push('Role must be selected.');
    }
    if (!this.selectedFile) {
      validationErrors.push('Profile Picture is required.');
    }

    Swal.fire({
      icon: 'error',
      title: 'Validation Error',
      html: `<ul>${validationErrors.map(error => `<li>${error}</li>`).join('')}</ul>`,
      confirmButtonText: 'OK'
    });
  }
}
