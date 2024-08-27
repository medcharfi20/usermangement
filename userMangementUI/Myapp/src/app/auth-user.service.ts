import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthUserService {
  private apiUrl = 'http://localhost:8080/api/users'; 
  private loggedIn = new BehaviorSubject<boolean>(false);
  private userId = new BehaviorSubject<number | null>(null);
  private rememberMe = new BehaviorSubject<boolean>(false); // New BehaviorSubject for remember me

  constructor(private http: HttpClient, private router: Router) {
    this.checkSession();
  }

  login(email: string, password: string, stayConnected: boolean): Observable<{ success: boolean; message?: string; userId?: number }> {
    const loginRequest = { email, password, stayConnected };
  
    return this.http.post<any>(`${this.apiUrl}/login`, loginRequest, { withCredentials: true })
      .pipe(
        map(response => {
          if (response.message === 'Login successful') {
            this.loggedIn.next(true);
            this.userId.next(response.user.id);
            this.rememberMe.next(stayConnected);
            if (stayConnected) {
              localStorage.setItem('USER_SESSION_COOKIE', response.cookieDetails.value);
              localStorage.setItem('User_ID', response.user.id.toString());
            } else {
              localStorage.removeItem('USER_SESSION_COOKIE');
              localStorage.removeItem('User_ID');
            }  
            return { success: true, userId: response.user.id };
          } else {
            return { success: false, message: response.message };
          }
        }),
        catchError(error => {
          console.error('Login error', error);
          let errorMsg = 'An unexpected error occurred during login.';
          if (error.status === 401) {
            errorMsg = 'Invalid email or password.';
          } else if (error.status === 403) {
            errorMsg = 'Your account is blocked. Please contact support.';
          }
          return of({ success: false, message: errorMsg });
        })
      );
  }
  
  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  getUserId(): Observable<number | null> {
    return this.userId.asObservable();
  }
  setUserId(id: number): void {
    this.userId.next(id);
  }

  isRememberMeChecked(): Observable<boolean> {
    return this.rememberMe.asObservable();
  }

  private checkSession(): void {
    const sessionCookie = localStorage.getItem('USER_SESSION_COOKIE');
    const storedUserId = localStorage.getItem('User_ID');

    if (sessionCookie && storedUserId) {
      this.loggedIn.next(true);
      this.userId.next(parseInt(storedUserId, 10));
      this.rememberMe.next(true);
    } else {
      this.loggedIn.next(false);
      this.userId.next(null);
      this.rememberMe.next(false);
    }
  }

  logout(): void {
    this.http.post<void>(`${this.apiUrl}/logout`, {}, { withCredentials: true }).subscribe({
      next: () => {
        this.loggedIn.next(false);
        this.userId.next(null);
        this.rememberMe.next(false);

        localStorage.removeItem('USER_SESSION_COOKIE');
        localStorage.removeItem('User_ID');

        this.router.navigate(['/home']); // Redirect to home page after logout
      },
      error: (err) => {
        console.error('Logout error', err);
      }
    });
  }
}
