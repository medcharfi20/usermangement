import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/superAdmin';
  private loggedIn = new BehaviorSubject<boolean>(false);
  private userId = new BehaviorSubject<number | null>(null);
  private rememberMe = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private router: Router) {
    this.checkSession();
  }

  login(email: string, password: string, stayConnected: boolean): Observable<boolean> {
    const loginRequest = { email, password, stayConnected };

    return this.http.post<any>(`${this.apiUrl}/login`, loginRequest, { withCredentials: true }).pipe(
      map(response => {
        if (response.message === 'Login successful' && response.user) {
          this.loggedIn.next(true);
          this.userId.next(response.user.id);
          this.rememberMe.next(stayConnected);

          if (stayConnected && response.cookieDetails) {
            localStorage.setItem('SESSION_COOKIE', response.cookieDetails.value);
            localStorage.setItem('SuperAdmin_ID', response.user.id.toString());
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

  getUserId(): Observable<number | null> {
    return this.userId.asObservable();
  }

  isRememberMeChecked(): Observable<boolean> {
    return this.rememberMe.asObservable();
  }

  private checkSession(): void {
    const sessionCookie = localStorage.getItem('SESSION_COOKIE');
    const storedUserId = localStorage.getItem('SuperAdmin_ID');

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

        localStorage.removeItem('SESSION_COOKIE');
        localStorage.removeItem('SuperAdmin_ID');

        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Logout error', err);
      }
    });
  }
}
