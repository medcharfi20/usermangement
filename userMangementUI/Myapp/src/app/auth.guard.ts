import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.isLoggedIn().pipe(
      map(isLoggedIn => {
        if (isLoggedIn) {
          return true;
        } else {
          console.log('Access denied. Redirecting to login.');
          this.router.navigate(['/login']);
          return false;
        }
      }),
      catchError(error => {
        console.error('Error occurred during authentication check', error);
        this.router.navigate(['/login']);
        return of(false);
      })
    );
  }
}