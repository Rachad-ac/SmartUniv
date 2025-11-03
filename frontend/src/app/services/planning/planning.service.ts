import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlanningService {


  constructor(private http: HttpClient) { }

  // Récupérer tous les plannings
 

  // Méthode générale (inchangée)
  getPlannings(filters?: any): Observable<any> {
    // ... (Logique de construction des HttpParams pour l'index) ...
    let params = new HttpParams();
    if (filters) {
        Object.keys(filters).forEach(key => {
            if (filters[key]) {
                params = params.set(key, filters[key]);
            }
        });
    }
    return this.http.get(`${environment.baseUrl}plannings/all`, { params });
}

// ⬅️ NOUVELLE MÉTHODE POUR LA VUE DÉTAILLÉE
getPlanningByFiliereAndClasse(id_filiere: number, id_classe: number): Observable<any> {
    // Cible la nouvelle route définie dans routes/api.php
    return this.http.get(`${environment.baseUrl}plannings/by-filiere-classe/${id_filiere}/${id_classe}`);
}

// 🔹 Planning par enseignant
getPlanningByUser(id_user: number): Observable<any> {
  return this.http.get(`${environment.baseUrl}plannings/by-user/${id_user}`);
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
  updatePlanning(id: any, data: any): Observable<any> {
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

  getFilieres(): Observable<any> {
    return this.http.get(`${environment.baseUrl}filieres/all`);
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
