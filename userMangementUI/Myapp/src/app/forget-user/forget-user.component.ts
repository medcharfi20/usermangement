import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { UserService } from '../user.service';

@Component({
  selector: 'app-forget-user',
  templateUrl: './forget-user.component.html',
  styleUrls: ['./forget-user.component.css']
})
export class ForgetUserComponent implements OnInit {
  forgetUserForm: FormGroup = this.fb.group({}); // Initialize with an empty FormGroup
  actionType: 'retrieveEmail' | 'changePassword' = 'retrieveEmail';
  passwordVisible: boolean = false;

  constructor(private userService: UserService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.forgetUserForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      numeroTelephone: ['', Validators.required],
      newPassword: [''], // Optional field for changing password
      fullName: [''] // Full name used in password change
    });

    // Set validators based on the initial action type
    this.updateValidators();
  }

  onActionTypeChange(actionType: 'retrieveEmail' | 'changePassword'): void {
    this.actionType = actionType;
    this.updateValidators();
  }

  private updateValidators(): void {
    const isChangingPassword = this.actionType === 'changePassword';
    
    this.forgetUserForm.get('newPassword')?.setValidators(isChangingPassword ? Validators.required : null);
    this.forgetUserForm.get('fullName')?.setValidators(isChangingPassword ? Validators.required : null);
    
    this.forgetUserForm.get('newPassword')?.updateValueAndValidity();
    this.forgetUserForm.get('fullName')?.updateValueAndValidity();
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  onSubmit(): void {
    if (this.forgetUserForm.valid) {
      const { firstname, lastname, dateOfBirth, numeroTelephone, newPassword, fullName } = this.forgetUserForm.value;

      if (this.actionType === 'retrieveEmail') {
        this.retrieveEmail(firstname, lastname, dateOfBirth, numeroTelephone);
      } else {
        this.changePassword(firstname, lastname, dateOfBirth, numeroTelephone, newPassword, fullName);
      }
    } else {
      Swal.fire({
        title: 'Error',
        text: 'Please fill out all required fields.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  }

  private retrieveEmail(firstname: string, lastname: string, dateOfBirth: string, numeroTelephone: string): void {
    this.userService.retrieveEmail(firstname, lastname, dateOfBirth, numeroTelephone)
      .subscribe({
        next: (email) => Swal.fire({
          title: 'Success',
          text: `Your email is: ${email}`,
          icon: 'success',
          confirmButtonText: 'OK'
        }),
        error: (error) => Swal.fire({
          title: 'Error',
          text: `Failed to retrieve email: ${error.message}`,
          icon: 'error',
          confirmButtonText: 'OK'
        })
      });
  }

  private changePassword(firstname: string, lastname: string, dateOfBirth: string, numeroTelephone: string, newPassword: string, fullName: string): void {
    this.userService.changePassword(firstname, lastname, dateOfBirth, numeroTelephone, newPassword, fullName)
      .subscribe({
        next: () => Swal.fire({
          title: 'Success',
          text: 'Password changed successfully.',
          icon: 'success',
          confirmButtonText: 'OK'
        }),
        error: (error) => Swal.fire({
          title: 'Error',
          text: `Failed to change password: ${error.message}`,
          icon: 'error',
          confirmButtonText: 'OK'
        })
      });
  }
}
