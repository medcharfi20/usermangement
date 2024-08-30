import { Component } from '@angular/core';
import { SuperAdminService } from '../super-admin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forget',
  templateUrl: './forget.component.html',
  styleUrls: ['./forget.component.css']
})
export class ForgetComponent {
  firstname: string = '';
  lastname: string = '';
  dateOfBirth: string = '';
  numeroTelephone: string = '';
  newPassword: string = '';
  selectedProcess: string = 'retrieveEmail'; // Default to retrieve email

  showPassword: boolean = false; // Toggle for password visibility

  constructor(private superAdminService: SuperAdminService) {}

  togglePasswordVisibility() {
    const passwordInput = document.getElementById('newPassword') as HTMLInputElement;
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
  }
  

  retrieveEmail() {
    this.superAdminService.retrieveEmail(this.firstname, this.lastname, this.dateOfBirth, this.numeroTelephone)
      .subscribe({
        next: (email) => {
          Swal.fire({
            title: 'Email Retrieved Successfully!',
            text: `The email associated with this account is: ${email}`,
            icon: 'success'
          });
        },
        error: (err) => {
          Swal.fire({
            title: 'Error!',
            text: 'Failed to retrieve email. Please check your input and try again.',
            icon: 'error'
          });
          console.error('Error retrieving email:', err);
        }
      });
  }

  changePassword() {
    this.superAdminService.changePassword(this.firstname, this.lastname, this.dateOfBirth, this.numeroTelephone, this.newPassword)
      .subscribe({
        next: () => {
          Swal.fire({
            title: 'Password Changed Successfully!',
            text: 'Your password has been updated.',
            icon: 'success'
          });
        },
        error: (err) => {
          Swal.fire({
            title: 'Error!',
            text: 'Failed to change password. Please check your input and try again.',
            icon: 'error'
          });
          console.error('Error changing password:', err);
        }
      });
  }
}
