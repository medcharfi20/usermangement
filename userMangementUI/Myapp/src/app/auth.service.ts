import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/superadmin';
  private loggedIn = new BehaviorSubject<boolean>(false);
  private superAdminId = new BehaviorSubject<number | null>(null);
  private rememberMe = new BehaviorSubject<boolean>(false);

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
            this.superAdminId.next(response.superAdmin.id);
            this.rememberMe.next(stayConnected);

            if (stayConnected && response.cookieDetails) {
              localStorage.setItem('SESSION_COOKIE', response.cookieDetails.value);
              localStorage.setItem('SuperAdmin_ID', response.superAdmin.id.toString());
            } else {
              localStorage.removeItem('SESSION_COOKIE');
              localStorage.removeItem('SuperAdmin_ID');
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

  getSuperAdminId(): Observable<number | null> {
    return this.superAdminId.asObservable();
  }

  isRememberMeChecked(): Observable<boolean> {
    return this.rememberMe.asObservable();
  }

  private checkSession(): void {
    const sessionCookie = localStorage.getItem('SESSION_COOKIE');
    const storedSuperAdminId = localStorage.getItem('SuperAdmin_ID');
  
    if (sessionCookie && storedSuperAdminId) {
      this.loggedIn.next(true);
      this.superAdminId.next(parseInt(storedSuperAdminId, 10));
      this.rememberMe.next(true);
    } else {
      this.loggedIn.next(false);
      this.superAdminId.next(null);
      this.rememberMe.next(false);
    }
  }
  
  logout(): void {
    this.http.post<void>(`${this.apiUrl}/logout`, {}, { withCredentials: true }).subscribe({
      next: () => {
        this.loggedIn.next(false);
        this.superAdminId.next(null);
        this.rememberMe.next(false);
  
        localStorage.removeItem('SESSION_COOKIE');
        localStorage.removeItem('SuperAdmin_ID');
  
        this.router.navigate(['/home']); // Redirect to home page after logout
      },
      error: (err) => {
        console.error('Logout error', err);
      }
    });
  }  
}
