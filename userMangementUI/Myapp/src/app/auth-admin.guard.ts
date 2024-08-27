import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { AuthAdminService } from './auth-admin.service'; // Adjust path as necessary

@Injectable({
  providedIn: 'root'
})
export class AuthAdminGuard implements CanActivate {

  constructor(private authAdminService: AuthAdminService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.authAdminService.isLoggedIn().pipe(
      map(isLoggedIn => {
        if (!isLoggedIn) {
          this.router.navigate(['/loginadmin']); 
          return false;
        }
        return true;
      }),
      catchError(() => {
        this.router.navigate(['/loginadmin']); 
        return of(false);
      })
    );
  }
}
