import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) {}

  getStats(): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}dashboard`);
  }

  getLatestUsers(): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}latest-users`);
  }

}
