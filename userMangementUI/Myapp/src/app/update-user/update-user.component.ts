import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { UserService } from '../user.service';
import Swal from 'sweetalert2';

// Email format validator with detailed error handling
const emailFormatValidator = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
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
    const value = control.value;
    if (!value) return null;

    const phonePattern = /^[0-9]{8}$/;
    return phonePattern.test(value) ? null : { invalidPhoneNumber: true };
  };
};

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent implements OnInit {
  updateForm!: FormGroup;
  userId: number | null = null;
  selectedFile: File | null = null;
  photoPreview: string | null = null;
  submitted = false;
  passwordVisible = false; 
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    if (isNaN(this.userId)) {
      console.error('Invalid User ID:', this.userId);
      return;
    }

    this.userService.getUserById(this.userId).subscribe(
      (data: any) => {
        this.updateForm.patchValue(data);
        if (data.photo) {
          this.photoPreview = `data:image/png;base64,${data.photo}`;
        }
      },
      (error: any) => {
        console.error('Error fetching user data:', error);
      }
    );
  }

  initializeForm() {
    this.updateForm = this.formBuilder.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, emailFormatValidator()]],
      numeroTelephone: ['', [Validators.required, phoneNumberValidator()]],
      dateDeNaissance: ['', Validators.required],
      password: ['', Validators.required],
      blocked: [false],  // User status field for blocked status
    });
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

    if (this.userId !== null) {
      this.userService.updateUser(this.userId, formData).subscribe(
        () => {
          Swal.fire({
            icon: 'success',
            title: 'Profile Updated',
            text: 'The user profile has been successfully updated!',
            confirmButtonText: 'OK'
          }).then(() => {
            this.goBackToProfile();
          });
        },
        (error: any) => {
          if (error.status === 409) {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Email already exists.',
              confirmButtonText: 'OK'
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'An error occurred while updating the user.',
              confirmButtonText: 'OK'
            });
          }
        }
      );
    }
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
    this.router.navigate(['/users']);
  }
}
