import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { UserService } from '../user.service'; // Adjust the import based on your service location
import Swal from 'sweetalert2';

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

// Define the User interface
export interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  dateDeNaissance: string;
  numeroTelephone: string;
  password: string;
  photo?: string;
}

@Component({
  selector: 'app-update-user-profile',
  templateUrl: './update-user-profile.component.html',
  styleUrls: ['./update-user-profile.component.css']
})
export class UpdateUserProfileComponent implements OnInit {
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
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      console.error('Invalid User ID:', id);
      return; // Handle error or redirect as needed
    }

    this.userId = id;

    // Fetch user details
    this.fetchUserDetails();
  }

  initializeForm() {
    this.updateForm = this.formBuilder.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, emailFormatValidator()]],
      numeroTelephone: ['', [Validators.required, phoneNumberValidator()]],
      dateDeNaissance: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  fetchUserDetails() {
    if (this.userId === null) return;

    this.userService.getUserById(this.userId).subscribe(
      (data: User) => {
        this.updateForm.patchValue({
          nom: data.nom,
          prenom: data.prenom,
          email: data.email,
          numeroTelephone: data.numeroTelephone,
          password: data.password,
          dateDeNaissance: data.dateDeNaissance
        });
        if (data.photo) {
          this.photoPreview = `data:image/png;base64,${data.photo}`;
        }
      },
      (error: any) => {
        console.error('Error fetching user data:', error);
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

    if (this.userId === null) {
      console.error('User ID is null');
      return;
    }

    const formData = new FormData();

    // Append form fields with correct names
    formData.append('nom', this.updateForm.get('nom')?.value);
    formData.append('prenom', this.updateForm.get('prenom')?.value);
    formData.append('email', this.updateForm.get('email')?.value);
    formData.append('password', this.updateForm.get('password')?.value);
    formData.append('dateDeNaissance', this.updateForm.get('dateDeNaissance')?.value);
    formData.append('numeroTelephone', this.updateForm.get('numeroTelephone')?.value);

    // Append the selected file if it exists
    if (this.selectedFile) {
      formData.append('photo', this.selectedFile, this.selectedFile.name);
    }

    this.userService.updateUser(this.userId, formData).subscribe(
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
      validationErrors.push('First Name is required.');
    }
    if (this.updateForm.get('prenom')?.hasError('required')) {
      validationErrors.push('Last Name is required.');
    }
    if (this.updateForm.get('email')?.hasError('required')) {
      validationErrors.push('Email is required.');
    }
    if (this.updateForm.get('email')?.hasError('missingBoth')) {
      validationErrors.push('Email must include "@" and "."');
    }
    if (this.updateForm.get('email')?.hasError('missingAt')) {
      validationErrors.push('Email must include "@"');
    }
    if (this.updateForm.get('email')?.hasError('missingDot')) {
      validationErrors.push('Email must include "."');
    }
    if (this.updateForm.get('numeroTelephone')?.hasError('required')) {
      validationErrors.push('Phone Number is required.');
    }
    if (this.updateForm.get('numeroTelephone')?.hasError('invalidPhoneNumber')) {
      validationErrors.push('Phone Number must be exactly 8 digits.');
    }
    if (this.updateForm.get('dateDeNaissance')?.hasError('required')) {
      validationErrors.push('Date of Birth is required.');
    }
    if (this.updateForm.get('password')?.hasError('required')) {
      validationErrors.push('Password is required.');
    }

    Swal.fire({
      icon: 'error',
      title: 'Validation Errors',
      html: `<ul>${validationErrors.map(err => `<li>${err}</li>`).join('')}</ul>`,
      confirmButtonText: 'OK'
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.photoPreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  goBackToProfile() {
    if (this.userId !== null) {
      this.router.navigate([`/profileuser/${this.userId}`]); // Adjust route as needed
    } else {
      console.error('User ID is null. Cannot navigate to profile.');
    }
  }
  
}
