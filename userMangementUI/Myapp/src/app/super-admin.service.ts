import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SuperAdminService {
  private apiUrl = 'http://localhost:8080/api/superadmin';

  constructor(private http: HttpClient) {}

  // Fetch user data by ID (number)
  getUserData(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Update user data (userId should be a number if that's the consistent type across your application)
  updateUser(userId: number, formData: FormData): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${userId}`, formData, {
      headers: {
        'Accept': 'application/json'
      }
    });
  }
}
