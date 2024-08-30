import { Injectable } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url = 'http://127.0.0.1:8080/api/users';

  constructor(private http: HttpClient) {}

  // Get all users
  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.url).pipe(
      map(users => users.map(user => this.mapResponseToUser(user))),
      catchError(this.handleError)
    );
  }

  // Get user by ID
  getUserById(id: number): Observable<any> {
    return this.http.get<any>(`${this.url}/${id}`).pipe(
      map(user => this.mapResponseToUser(user)),
      catchError(this.handleError)
    );
  }

  // Create a new user
  createUser(user: any, photo?: File): Observable<any> {
    const formData = new FormData();
    formData.append('nom', user.nom);
    formData.append('prenom', user.prenom);
    formData.append('email', user.email);
    formData.append('password', user.password);
    formData.append('dateDeNaissance', user.dateDeNaissance);
    formData.append('numeroTelephone', user.numeroTelephone);
    formData.append('blocked', user.blocked); 
    if (photo) {
      formData.append('photo', photo);
    }

    return this.http.post<any>(this.url, formData, { responseType: 'text' as 'json' }).pipe(
      catchError(this.handleError)
    );
  }

  // Update an existing user
  updateUser(id: number, formData: FormData): Observable<any> {
    return this.http.put<any>(`${this.url}/${id}`, formData, { responseType: 'text' as 'json' }).pipe(
      catchError(this.handleError)
    );
  }
  // Delete a user
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Delete all users
  deleteAllUsers(): Observable<void> {
    return this.http.delete<void>(this.url).pipe(
      catchError(this.handleError)
    );
  }

  // Search users by name
  searchUsersByName(searchTerm: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/search?name=${searchTerm}`).pipe(
      map(users => users.map(user => this.mapResponseToUser(user))),
      catchError(this.handleError)
    );
  }

  // Map response to include the `blocked` field as `isBlocked`
  private mapResponseToUser(user: any): any {
    return {
      ...user,
      isBlocked: user.blocked // Convert `blocked` to `isBlocked`
    };
  }
  retrieveEmail(firstname: string, lastname: string, dateOfBirth: string, numeroTelephone: string): Observable<string> {
    const params = new HttpParams()
      .set('nom', firstname)
      .set('prenom', lastname)
      .set('numeroTelephone', numeroTelephone)
      .set('dateDeNaissance', dateOfBirth);
    
    return this.http.get<string>(`${this.url}/retrieve-email`, { params, responseType: 'text' as 'json' })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Change password for a user
  changePassword(firstname: string, lastname: string, dateOfBirth: string, numeroTelephone: string, newPassword: string, fullName: string): Observable<any> {
    const params = new HttpParams()
      .set('nom', firstname)
      .set('prenom', lastname)
      .set('dateDeNaissance', dateOfBirth)
      .set('numeroTelephone', numeroTelephone)
      .set('newPassword', newPassword)
      .set('fullName', fullName);
    
    return this.http.post<any>(`${this.url}/change-password`, null, { params, responseType: 'text' as 'json' })
      .pipe(
        catchError(this.handleError)
      );
  }
  private handleError(error: any) {
    console.error('An error occurred:', error); 
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }
}
