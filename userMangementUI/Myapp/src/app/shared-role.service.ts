import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SharedRoleService {
  private baseUrl = 'http://localhost:8080/api/roles'; 

  constructor(private http: HttpClient) {}

  createRole(role: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, role, { responseType: 'text' as 'json' }).pipe(
      catchError(this.handleError)
    );
  }

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl).pipe(
      catchError(this.handleError)
    );
  }

  getRoleById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/id/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  getRoleByName(name: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/name/${name}`).pipe(
      catchError(this.handleError)
    );
  }

  updateRole(id: number, role: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, role).pipe(
      catchError(this.handleError)
    );
  }

  deleteRole(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  deleteAllRoles(): Observable<void> { 
    return this.http.delete<void>(this.baseUrl).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred.
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      switch (error.status) {
        case 409:
          errorMessage = 'Role name already exists';
          break;
        case 404:
          errorMessage = 'Resource not found';
          break;
        case 500:
          errorMessage = 'Server error occurred';
          break;
        default:
          errorMessage = `Server-side error: ${error.status} - ${error.message}`;
          break;
      }
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
