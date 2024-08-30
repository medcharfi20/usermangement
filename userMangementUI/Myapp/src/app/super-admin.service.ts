import { HttpClient,HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable,throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class SuperAdminService {
  private apiUrl = 'http://localhost:8080/api/superadmin';

  constructor(private http: HttpClient) {}

  getUserData(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  updateUser(userId: number, formData: FormData): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${userId}`, formData, {
      headers: {
        'Accept': 'application/json'
      }
    });
  }
  retrieveEmail(firstname: string, lastname: string, dateOfBirth: string, numeroTelephone: string): Observable<string> {
    const params = new HttpParams()
      .set('nom', firstname)
      .set('prenom', lastname)
      .set('numeroTelephone', numeroTelephone)
      .set('dateDeNaissance', dateOfBirth)
    return this.http.get<string>(`${this.apiUrl}/retrieve-email`, { params, responseType: 'text' as 'json' })
      .pipe(
        catchError(error => {
          console.error('An error occurred while retrieving email:', error);
          return throwError('Failed to retrieve email; please try again later.');
        })
      );
  }
  changePassword(firstname: string, lastname: string, dateOfBirth: string, numeroTelephone: string, newPassword: string): Observable<any> {
    const params = new HttpParams()
      .set('nom', firstname)
      .set('prenom', lastname)
      .set('dateDeNaissance', dateOfBirth)
      .set('numeroTelephone', numeroTelephone)
      .set('newPassword', newPassword);
    return this.http.post<any>(`${this.apiUrl}/change-password`, null, { params, responseType: 'text' as 'json' })
      .pipe(
        catchError(error => {
          console.error('An error occurred while changing password:', error);
          return throwError('Failed to change password; please try again later.');
        })
      );
  }
}
