import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  constructor(private http: HttpClient) { }

  /**
   * Récupère toutes les réservations (index)
   * GET /api/reservations
   */
  getAllReservations(): Observable<any> {
    // Controller index() maps to a standard GET on the resource route
    return this.http.get<any>(`${environment.baseUrl}reservations/all`);
  }

  /**
   * Récupère toutes les réservations (index)
   * GET /api/reservations
   */
  getReservationEnAttente(): Observable<any> {
    // Controller reservationEnAttente() maps to a standard GET on the resource route
    return this.http.get<any>(`${environment.baseUrl}reservations/en-attente`);
  }

  /**
   * Récupère les réservations d'un utilisateur spécifique (mesReservations)
   * GET /api/mes-reservations/{id}
   */
  getUserReservations(userId: number): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}reservations/mes-reservations/${userId}`);
  }

  /**
   * Récupère une réservation par ID
   * GET /api/reservations/{id}
   */
  getReservationById(reservationId: any): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}reservations/${reservationId}`);
  }

  /**
   * Recherche/Filtrage de réservations (search)
   * GET /api/reservations/search?id_salle=&date=&statut=
   */
  searchReservations(criteria: any): Observable<any> {
    let params = new HttpParams();

    for (const key in criteria) {
        if (criteria.hasOwnProperty(key) && criteria[key] !== null && criteria[key] !== '') {
            params = params.set(key, criteria[key]);
        }
    }
    
    return this.http.get(`${environment.baseUrl}reservations/search`, { params: params });
  }

  // --- WRITE / UPDATE Operations ---

  /**
   * Crée une nouvelle réservation (store)
   * POST /api/reservations/reserver
   */
  createReservation(reservation: any): Observable<any> {
    return this.http.post<any>(`${environment.baseUrl}reservations/reserver`, reservation);
  }

  /**
   * Met à jour une réservation existante (update)
   * PUT /api/reservations/{id}
   */
  updateReservation(reservationId: any, reservation: any): Observable<any> {
    return this.http.put<any>(`${environment.baseUrl}reservations/${reservationId}`, reservation);
  }

  /**
   * Met à jour une réservation existante (update)
   * PUT /api/reservations/{id}
   */
  annulerReservation(reservationId: any): Observable<any> {
    return this.http.post<any>(`${environment.baseUrl}reservations/annuler/${reservationId}`, {});
  }

  /**
   * Valide une réservation (valider)
   * PUT /api/reservations/valider/{id}
   */
  validateReservation(reservationId: any): Observable<any> {
    // Assuming the valider route uses a PUT method and expects no body data
    return this.http.put<any>(`${environment.baseUrl}reservations/valider/${reservationId}`, {});
  }

  /**
   * Rejette une réservation (rejeter)
   * PUT /api/reservations/rejeter/{id}
   */
  rejectReservation(reservationId: any): Observable<any> {
    // Assuming the rejeter route uses a PUT method and expects no body data
    return this.http.put<any>(`${environment.baseUrl}reservations/rejeter/${reservationId}`, {});
  }


  /**
   * Supprime une réservation (destroy)
   * DELETE /api/reservations/{id}
   */
  deleteReservation(reservationId: any): Observable<any> {
    return this.http.delete<any>(`${environment.baseUrl}reservations/${reservationId}`);
  }
  

  /**
   * Vérifie la disponibilité d'une salle pour une période donnée (checkAvailability)
   * POST /api/reservations/check-availability
   */
  checkAvailability(data: { id_salle: number, date_debut: string, date_fin: string }): Observable<any> {
    // This is typically a POST or GET with specific query params. Using POST as per controller's store/check logic.
    return this.http.post<any>(`${environment.baseUrl}reservations/check-availability`, data);
  }
}