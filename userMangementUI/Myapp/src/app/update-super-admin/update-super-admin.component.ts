import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { SuperAdminService } from '../super-admin.service';
import Swal from 'sweetalert2';

// Custom validator for email format
function emailFormatValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const email = control.value || '';

    if (email === '') {
      return null; // Do not validate if the field is empty
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

// Custom validator for phone number
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
  selector: 'app-update-super-admin',
  templateUrl: './update-super-admin.component.html',
  styleUrls: ['./update-super-admin.component.css']
})
export class UpdateSuperAdminComponent implements OnInit {
  updateForm!: FormGroup;
  userId: number | null = null;
  photoPreview: string | ArrayBuffer | null = null;
  passwordFieldType: string = 'password'; // default to password field type

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private superAdminService: SuperAdminService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.userId = Number(this.route.snapshot.paramMap.get('id'));

    if (isNaN(this.userId)) {
      console.error('Invalid User ID:', this.userId);
      return;
    }

    this.superAdminService.getUserData(this.userId).subscribe(data => {
      this.updateForm.patchValue(data);
      if (data.photo) {
        this.photoPreview = `data:image/png;base64,${data.photo}`;
      }
    }, error => {
      console.error('Error fetching user data:', error);
    });
  }

  initializeForm() {
    this.updateForm = this.formBuilder.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, emailFormatValidator()]],
      numeroTelephone: ['', [Validators.required, phoneNumberValidator()]],
      dateDeNaissance: ['', Validators.required],
      password: ['', Validators.required],
      file: [null]
    });
  }

  onSubmit() {
    if (this.updateForm.invalid) {
      this.triggerValidationAlert();
      return;
    }

    const formData = new FormData();
    Object.keys(this.updateForm.controls).forEach(key => {
      const control = this.updateForm.get(key);
      if (control) {
        if (key === 'file') {
          const file = control.value;
          if (file) {
            formData.append(key, file, file.name);
          }
        } else {
          formData.append(key, control.value);
        }
      }
    });

    if (this.userId !== null) {
      this.superAdminService.updateUser(this.userId, formData).subscribe(() => {
        Swal.fire({
          icon: 'success',
          title: 'Profile Updated',
          text: 'The super admin profile has been successfully updated!',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/superAdminProfile', this.userId]);
        });
      }, error => {
        console.error('Error updating user data:', error);
        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: 'There was an error updating the profile. Please try again later.',
          confirmButtonText: 'OK'
        });
      });
    }
  }

  triggerValidationAlert() {
    const emailControl = this.updateForm.get('email');
    const phoneControl = this.updateForm.get('numeroTelephone');

    let validationErrors: string[] = [];

    if (this.updateForm.get('nom')?.hasError('required')) {
      validationErrors.push('First Name cannot be empty.');
    }
    if (this.updateForm.get('prenom')?.hasError('required')) {
      validationErrors.push('Last Name cannot be empty.');
    }
    if (emailControl?.hasError('required')) {
      validationErrors.push('Email cannot be empty.');
    }
    if (emailControl?.hasError('emailFormat')) {
      const errorType = emailControl.errors?.['emailFormat'];
      if (errorType === 'missingBoth') {
        validationErrors.push('Email address is missing both "@" and ".".');
      } else if (errorType === 'missingAt') {
        validationErrors.push('Email address is missing "@" symbol.');
      } else if (errorType === 'missingDot') {
        validationErrors.push('Email address is missing "." symbol.');
      }
    }
    if (phoneControl?.hasError('required')) {
      validationErrors.push('Phone Number cannot be empty.');
    }
    if (phoneControl?.hasError('phoneNumber')) {
      const errorType = phoneControl.errors?.['phoneNumber'];
      if (errorType === 'notNumeric') {
        validationErrors.push('Phone Number must be numeric.');
      }
      if (errorType === 'invalidLength') {
        validationErrors.push('Phone Number must be exactly 8 digits.');
      }
      if (errorType === 'notNumericAndInvalidLength') {
        validationErrors.push('Phone Number must be numeric and exactly 8 digits.');
      }
    }
    if (this.updateForm.get('dateDeNaissance')?.hasError('required')) {
      validationErrors.push('Date of Birth cannot be empty.');
    }
    if (this.updateForm.get('password')?.hasError('required')) {
      validationErrors.push('Password cannot be empty.');
    }

    if (validationErrors.length > 0) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: validationErrors.join(' '),
        confirmButtonText: 'OK'
      });
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.updateForm.patchValue({
        file: file
      });

      const reader = new FileReader();
      reader.onload = () => {
        this.photoPreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  goBackToProfile() {
    if (this.userId !== null) {
      this.router.navigate(['/superAdminProfile', this.userId]);
    }
  }
}
