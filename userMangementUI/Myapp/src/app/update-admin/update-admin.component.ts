import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { AdminService } from '../admin.service';
import Swal from 'sweetalert2';
import { Observable, of } from 'rxjs';
import { switchMap, startWith, catchError, map } from 'rxjs/operators';

// Email format validator with detailed error handling
const emailFormatValidator = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value || '';
    const hasAt = value.includes('@');
    const hasDot = value.includes('.');

    if (!value) return null;

    if (!hasAt && !hasDot) {
      return { missingBoth: true };
    } else if (!hasAt) {
      return { missingAt: true };
    } else if (!hasDot) {
      return { missingDot: true };
    } else {
      return null;
    }
  };
};

// Phone number validator
const phoneNumberValidator = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value || '';
    const phonePattern = /^[0-9]{8}$/;
    return phonePattern.test(value) ? null : { invalidPhoneNumber: true };
  };
};

// Define the Admin interface
export interface Admin {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  numeroTelephone: string;
  photo?: string;
  role?: {
    id: number;
    name: string;
    description?: string;
  };
}

@Component({
  selector: 'app-update-admin',
  templateUrl: './update-admin.component.html',
  styleUrls: ['./update-admin.component.css']
})
export class UpdateAdminComponent implements OnInit {
  updateForm!: FormGroup;
  adminId: number | null = null;
  selectedFile: File | null = null;
  photoPreview: string | null = null;
  submitted = false;
  passwordVisible = false;
  roles: { id: number, name: string }[] = []; // Array to store roles for selection
  roleName$: Observable<string> = of(''); // Observable for role name display

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      console.error('Invalid Admin ID:', id);
      return; // Handle error or redirect as needed
    }

    this.adminId = id;

    // Fetch admin details and roles
    this.fetchAdminDetails();
    this.fetchRoles();
  }

  initializeForm() {
    this.updateForm = this.formBuilder.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, emailFormatValidator()]],
      numeroTelephone: ['', [Validators.required, phoneNumberValidator()]],
      dateDeNaissance: ['', Validators.required],
      password: ['', Validators.required],
      roleId: ['', Validators.required] // Add roleId field
    });
  }

  fetchAdminDetails() {
    if (this.adminId === null) return;

    this.adminService.getAdminById(this.adminId).subscribe(
      (data: Admin) => {
        this.updateForm.patchValue(data);
        if (data.photo) {
          this.photoPreview = `data:image/png;base64,${data.photo}`;
        }
        if (data.role) {
          this.updateForm.patchValue({ roleId: data.role.id });
          this.roleName$ = of(data.role.name); // Set the role name observable
        }
      },
      (error: any) => {
        console.error('Error fetching admin data:', error);
      }
    );
  }

  fetchRoles() {
    this.adminService.getAllRoles().subscribe(
      (roles: { id: number, name: string }[]) => {
        this.roles = roles;
      },
      (error: any) => {
        console.error('Error fetching roles:', error);
      }
    );
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  onSubmit() {
    this.submitted = true;

    if (this.updateForm.invalid) {
      this.triggerValidationAlert();
      return;
    }

    if (this.adminId === null) {
      console.error('Admin ID is null');
      return;
    }

    const formData = new FormData();

    Object.keys(this.updateForm.controls).forEach(key => {
      const control = this.updateForm.get(key);
      if (control) {
        formData.append(key, control.value);
      }
    });

    if (this.selectedFile) {
      formData.append('photo', this.selectedFile, this.selectedFile.name);
    }

    this.adminService.updateAdmin(this.adminId, formData).subscribe(
      () => {
        Swal.fire({
          icon: 'success',
          title: 'Profile Updated',
          text: 'The profile has been successfully updated!',
          confirmButtonText: 'OK'
        }).then(() => {
          this.goBackToProfile();
        });
      },
      (error: any) => {
        let errorMessage = 'An error occurred while updating the profile.';
        if (error.status === 409) {
          errorMessage = 'Email already exists.';
        } else if (error.status === 400) {
          errorMessage = 'Bad request. Please check your input.';
        }
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorMessage,
          confirmButtonText: 'OK'
        });
      }
    );
  }

  triggerValidationAlert() {
    let validationErrors: string[] = [];

    if (this.updateForm.get('nom')?.hasError('required')) {
      validationErrors.push('First Name cannot be empty.');
    }
    if (this.updateForm.get('prenom')?.hasError('required')) {
      validationErrors.push('Last Name cannot be empty.');
    }
    if (this.updateForm.get('email')?.hasError('required')) {
      validationErrors.push('Email cannot be empty.');
    }

    const emailControl = this.updateForm.get('email');
    if (emailControl?.hasError('missingBoth')) {
      validationErrors.push('Email address is missing both "@" and ".".');
    } else if (emailControl?.hasError('missingAt')) {
      validationErrors.push('Email address is missing "@" symbol.');
    } else if (emailControl?.hasError('missingDot')) {
      validationErrors.push('Email address is missing "." symbol.');
    }

    if (this.updateForm.get('numeroTelephone')?.hasError('required')) {
      validationErrors.push('Phone Number cannot be empty.');
    }
    if (this.updateForm.get('numeroTelephone')?.hasError('invalidPhoneNumber')) {
      validationErrors.push('Phone Number must be exactly 8 digits.');
    }
    if (this.updateForm.get('password')?.hasError('required')) {
      validationErrors.push('Password cannot be empty.');
    }
    if (this.updateForm.get('dateDeNaissance')?.hasError('required')) {
      validationErrors.push('Date of Birth cannot be empty.');
    }

    if (validationErrors.length > 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Errors',
        html: validationErrors.join('<br>'),
        confirmButtonText: 'OK'
      });
    }
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.photoPreview = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  goBackToProfile() {
    this.router.navigate(['/admin']);
  }
}
