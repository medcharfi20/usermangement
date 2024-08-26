import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthAdminService {
  private apiUrl = 'http://localhost:8080/api/admins'; // Adjust URL as needed
  private loggedIn = new BehaviorSubject<boolean>(false);
  private adminId = new BehaviorSubject<number | null>(null);
  private rememberMe = new BehaviorSubject<boolean>(false); // New BehaviorSubject for remember me

  constructor(private http: HttpClient, private router: Router) {
    this.checkSession();
  }

  login(email: string, password: string, stayConnected: boolean): Observable<boolean> {
    const loginRequest = { email, password, stayConnected };

    return this.http.post<any>(`${this.apiUrl}/login`, loginRequest, { withCredentials: true })
      .pipe(
        map(response => {
          if (response.message === 'Login successful') {
            this.loggedIn.next(true);
            this.adminId.next(response.admin.id);
            this.rememberMe.next(stayConnected);

            // Storing the remember me status and Admin ID in localStorage
            if (stayConnected) {
              localStorage.setItem('ADMIN_SESSION_COOKIE', response.cookieDetails.value);
              localStorage.setItem('Admin_ID', response.admin.id.toString());
            } else {
              localStorage.removeItem('ADMIN_SESSION_COOKIE');
              localStorage.removeItem('Admin_ID');
            }
            return true;
          } else {
            return false;
          }
        }),
        catchError(error => {
          console.error('Login error', error);
          return of(false);
        })
      );
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  getAdminId(): Observable<number | null> {
    return this.adminId.asObservable();
  }

  isRememberMeChecked(): Observable<boolean> {
    return this.rememberMe.asObservable();
  }

  private checkSession(): void {
    const sessionCookie = localStorage.getItem('ADMIN_SESSION_COOKIE');
    const storedAdminId = localStorage.getItem('Admin_ID');

    if (sessionCookie && storedAdminId) {
      this.loggedIn.next(true);
      this.adminId.next(parseInt(storedAdminId, 10));
      this.rememberMe.next(true);
    } else {
      this.loggedIn.next(false);
      this.adminId.next(null);
      this.rememberMe.next(false);
    }
  }

  logout(): void {
    this.http.post<void>(`${this.apiUrl}/logout`, {}, { withCredentials: true }).subscribe({
      next: () => {
        this.loggedIn.next(false);
        this.adminId.next(null);
        this.rememberMe.next(false);

        localStorage.removeItem('ADMIN_SESSION_COOKIE');
        localStorage.removeItem('Admin_ID');

        this.router.navigate(['/home']); // Redirect to home page after logout
      },
      error: (err) => {
        console.error('Logout error', err);
      }
    });
  }
}
