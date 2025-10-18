import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HistoriqueReservationService {

  constructor(private http: HttpClient) { }

  /**
   * Récupère toutes les filières
   */
  getHistoriqueReservations(): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}historique-reservations/all`);
  }

  /**
   * Met à jour une filière existante
   */
  updateHistoriqueReservations(id: number, Data: any): Observable<any> {
    return this.http.put<any>(`${environment.baseUrl}historique-reservations/${id}`, Data);
  }

  /**
   * Supprime une filière
   */
  deleteHistoriqueReservations(id: number): Observable<any> {
    return this.http.delete(`${environment.baseUrl}historique-reservations/${id}`);
  }

}
