import { Injectable } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthUserService } from './auth-user.service'; // Adjust the import path as necessary
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthUserGuard {

  constructor(private authUserService: AuthUserService, private router: Router) { }

  canActivate: CanActivateFn = (route, state) => {
    return this.authUserService.isLoggedIn().pipe(
      map(isLoggedIn => {
        if (!isLoggedIn) {
          this.router.navigate(['/loginuser']); 
          return false;
        }
        return true;
      }),
      catchError(() => {
        this.router.navigate(['/loginuser']);
        return of(false);
      })
    );
  }
}
