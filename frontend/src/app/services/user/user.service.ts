import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}users/all`);
  }

  SearchUsers(criteria: any): Observable<any> {
    let params = new HttpParams();

    for (const key in criteria) {
        if (criteria.hasOwnProperty(key)) {
            params = params.set(key, criteria[key]);
        }
    }
    
    return this.http.get(`${environment.baseUrl}users/search`, { params: params });
}

  getUserById(userId : any): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}user/${userId}`);
  }

  deleteUser(userId : any): Observable<any> {
    return this.http.delete<any>(`${environment.baseUrl}user/delete/${userId}`);
  }

  updateUser(userId: any, user: any): Observable<any> {
    return this.http.put<any>(`${environment.baseUrl}user/${userId}`, user);
  }
}
