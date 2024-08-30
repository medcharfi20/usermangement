import { Component } from '@angular/core';
import { AdminService } from '../admin.service'; // Adjust the path if necessary
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forget-admin',
  templateUrl: './forget-admin.component.html',
  styleUrls: ['./forget-admin.component.css']
})
export class ForgetAdminComponent {
  firstname: string = '';
  lastname: string = '';
  dateOfBirth: string = '';
  numeroTelephone: string = '';
  newPassword: string = '';
  fullName: string = ''; // Add fullName attribute
  selectedProcess: string = 'retrieveEmail'; // Default to retrieve email

  showPassword: boolean = false; // Toggle for password visibility

  constructor(private adminService: AdminService) {}

  togglePasswordVisibility() {
    const passwordInput = document.getElementById('newPassword') as HTMLInputElement;
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
  }

  retrieveEmail() {
    this.adminService.retrieveEmail(this.firstname, this.lastname, this.dateOfBirth, this.numeroTelephone)
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
    this.adminService.changePassword(this.firstname, this.lastname, this.dateOfBirth, this.numeroTelephone, this.newPassword, this.fullName)
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
