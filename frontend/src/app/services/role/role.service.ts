import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private http: HttpClient) { }

  getAllRoles(): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}roles/all`);
  }

  getRoleById(id: number | string): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}roles/${id}`);
  }

  deleteRole(id: number | string): Observable<any> {
    return this.http.delete<any>(`${environment.baseUrl}roles/${id}`);
  }

  updateRole(id: number | string, payload: any): Observable<any> {
    return this.http.put<any>(`${environment.baseUrl}roles/${id}`, payload);
  }

  createRole(role: any): Observable<any> {
    return this.http.post<any>(`${environment.baseUrl}roles/create`, role);
  }
}
