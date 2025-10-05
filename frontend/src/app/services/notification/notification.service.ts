import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private http: HttpClient) { }

  getNotifs(userId : any): Observable<any > {
    return this.http.get<any>(`${environment.baseUrl}notifications/${userId}`);
  }

  ReadNotifs(userId : any): Observable<any > {
    return this.http.get<any>(`${environment.baseUrl}notifications/${userId}/read`);
  }

  deleteNotifs(userId : any): Observable<any > {
    return this.http.get<any>(`${environment.baseUrl}notifications/delete/${userId}`);
  }
}
