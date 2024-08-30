import { Injectable } from '@angular/core';
import { HttpClient,HttpParams} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private url = 'http://127.0.0.1:8080/api/admins';
  private rolesUrl = 'http://127.0.0.1:8080/api/roles'; 

  constructor(private http: HttpClient) {}

  getAllAdmins(): Observable<any[]> {
    return this.http.get<any[]>(this.url).pipe(
      catchError(this.handleError)
    );
  }

  getAdminById(id: number): Observable<any> {
    return this.http.get<any>(`${this.url}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createAdmin(admin: any, photo?: File): Observable<any> {
    const formData = new FormData();
    formData.append('nom', admin.nom);
    formData.append('prenom', admin.prenom);
    formData.append('email', admin.email);
    formData.append('password', admin.password);
    formData.append('dateDeNaissance', admin.dateDeNaissance);
    formData.append('numeroTelephone', admin.numeroTelephone);
    if (photo) {
      formData.append('photo', photo);
    }
    formData.append('roleId', admin.roleId); // Add role ID to form data

    return this.http.post<any>(this.url, formData, { responseType: 'text' as 'json' }).pipe(
      catchError(this.handleError)
    );
  }

  updateAdmin(id: number, formData: FormData): Observable<any> {
    return this.http.put<any>(`${this.url}/${id}`, formData, { responseType: 'text' as 'json' }).pipe(
      catchError(this.handleError)
    );
  }

  deleteAdmin(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  deleteAllAdmins(): Observable<void> {
    return this.http.delete<void>(this.url).pipe(
      catchError(this.handleError)
    );
  }

  searchAdminsByName(searchTerm: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/search?name=${searchTerm}`).pipe(
      catchError(this.handleError)
    );
  }

  getAllRoles(): Observable<any[]> { // Method to get all roles
    return this.http.get<any[]>(this.rolesUrl).pipe(
      catchError(this.handleError)
    );
  }
  retrieveEmail(firstname: string, lastname: string, dateOfBirth: string, numeroTelephone: string): Observable<string> {
    const params = new HttpParams()
      .set('nom', firstname)
      .set('prenom', lastname)
      .set('numeroTelephone', numeroTelephone)
      .set('dateDeNaissance', dateOfBirth);
    return this.http.get<string>(`${this.url}/retrieve-email`, { params, responseType: 'text' as 'json' })
      .pipe(
        catchError(error => {
          console.error('An error occurred while retrieving email:', error);
          return throwError(() => new Error('Failed to retrieve email; please try again later.'));
        })
      );
  }

  changePassword(firstname: string, lastname: string, dateOfBirth: string, numeroTelephone: string, newPassword: string,fullName:string): Observable<any> {
    const params = new HttpParams()
      .set('nom', firstname)
      .set('prenom', lastname)
      .set('dateDeNaissance', dateOfBirth)
      .set('numeroTelephone', numeroTelephone)
      .set('newPassword', newPassword)
      .set('fullName',fullName);
    return this.http.post<any>(`${this.url}/change-password`, null, { params, responseType: 'text' as 'json' })
      .pipe(
        catchError(error => {
          console.error('An error occurred while changing password:', error);
          return throwError(() => new Error('Failed to change password; please try again later.'));
        })
      );
  }


  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }
}
