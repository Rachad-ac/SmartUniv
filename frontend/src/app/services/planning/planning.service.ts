import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlanningService {


  constructor(private http: HttpClient) { }

  // Récupérer tous les plannings
  getPlannings(): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}plannings/all`);
  }

  // Récupérer un planning par ID
  getPlanning(id: number): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}plannings/${id}`);
  }

  // Créer un nouveau planning
  createPlanning(data: any): Observable<any> {
    return this.http.post<any>(`${environment.baseUrl}plannings/create`, data);
  }

  // Mettre à jour un planning existant
  updatePlanning(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${environment.baseUrl}plannings/${id}`, data);
  }

  // Supprimer un planning
  deletePlanning(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.baseUrl}plannings/${id}`);
  }

  
  // 🔹 Récupérer toutes les classes
  getClasses(): Observable<any> {
    return this.http.get(`${environment.baseUrl}classes/all`);
  }

  // 🔹 Récupérer tous les cours
  getCours(): Observable<any> {
    return this.http.get(`${environment.baseUrl}cours/all`);
  }

  // 🔹 Récupérer toutes les salles
  getSalles(): Observable<any> {
    return this.http.get(`${environment.baseUrl}salles/all`);
  }
}
