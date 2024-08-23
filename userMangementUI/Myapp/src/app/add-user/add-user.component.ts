import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
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
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent {
  userForm: FormGroup;
  selectedFile: File | null = null;
  passwordVisible = false; 

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, emailFormatValidator()]],
      password: ['', Validators.required],
      dateDeNaissance: ['', Validators.required],
      numeroTelephone: ['', [Validators.required, phoneNumberValidator()]],
      file: [null]
    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files.length > 0 ? event.target.files[0] : null;
    // Mark file control as touched
    this.userForm.get('file')?.markAsTouched();
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  onSubmit(): void {
    // Trigger validation for all controls
    this.userForm.markAllAsTouched();

    if (this.userForm.invalid || !this.selectedFile) {
      this.triggerValidationAlert();
      return;
    }

    const userData = this.userForm.value;

    this.userService.createUser(userData, this.selectedFile).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'User Added',
          text: 'The user has been added successfully!',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/users']); 
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

    if (this.userForm.get('nom')?.hasError('required')) {
      validationErrors.push('First Name cannot be empty.');
    }
    if (this.userForm.get('prenom')?.hasError('required')) {
      validationErrors.push('Last Name cannot be empty.');
    }
    if (this.userForm.get('email')?.hasError('required')) {
      validationErrors.push('Email cannot be empty.');
    }
    if (this.userForm.get('email')?.hasError('emailFormat')) {
      const errorType = this.userForm.get('email')?.errors?.['emailFormat'];
      if (errorType === 'missingBoth') {
        validationErrors.push('Email address is missing both "@" and ".".');
      } else if (errorType === 'missingAt') {
        validationErrors.push('Email address is missing "@" symbol.');
      } else if (errorType === 'missingDot') {
        validationErrors.push('Email address is missing "." symbol.');
      }
    }
    if (this.userForm.get('numeroTelephone')?.hasError('required')) {
      validationErrors.push('Phone Number cannot be empty.');
    }
    if (this.userForm.get('numeroTelephone')?.hasError('phoneNumber')) {
      const errorType = this.userForm.get('numeroTelephone')?.errors?.['phoneNumber'];
      if (errorType === 'notNumeric') {
        validationErrors.push('Phone Number must be numeric.');
      } else if (errorType === 'invalidLength') {
        validationErrors.push('Phone Number must be 8 digits.');
      } else if (errorType === 'notNumericAndInvalidLength') {
        validationErrors.push('Phone Number must be numeric and 8 digits.');
      }
    }
    if (this.userForm.get('password')?.hasError('required')) {
      validationErrors.push('Password cannot be empty.');
    }
    if (this.userForm.get('dateDeNaissance')?.hasError('required')) {
      validationErrors.push('Date of Birth cannot be empty.');
    }
    if (!this.selectedFile) {
      validationErrors.push('Profile Photo is required.');
    }

    Swal.fire({
      icon: 'error',
      title: 'Validation Error',
      html: validationErrors.join('<br/>'),
      confirmButtonText: 'OK'
    });
  }
}
