import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MatiereService {

  // Inject the HttpClient module for making API calls
  constructor(private http: HttpClient) { }

  // --- READ Operations ---

  /**
   * Récupère toutes les matières/sujets
   * GET /api/matieres/all
   */
  getMatieres(): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}matieres/all`);
  }

  /**
   * Récupère une matière par ID
   * GET /api/matieres/{id}
   */
  getMatiereById(matiereId: any): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}matieres/${matiereId}`);
  }

  /**
   * Recherche de matières avec critères (nom, code, etc.)
   * GET /api/matieres/search?nom=&code=
   */
  searchMatieres(criteria: any): Observable<any> {
    let params = new HttpParams();

    // Iterate over criteria object to build query parameters
    for (const key in criteria) {
        // Only add parameters that exist and are not null or empty strings
        if (criteria.hasOwnProperty(key) && criteria[key] !== null && criteria[key] !== '') {
            params = params.set(key, criteria[key]);
        }
    }
    
    return this.http.get(`${environment.baseUrl}matieres/search`, { params: params });
  }

  // --- WRITE Operations ---

  /**
   * Crée une nouvelle matière
   * POST /api/matieres
   */
  createMatiere(matiere: any): Observable<any> {
    return this.http.post<any>(`${environment.baseUrl}matieres`, matiere);
  }

  /**
   * Met à jour une matière existante
   * PUT /api/matieres/{id}
   */
  updateMatiere(matiereId: any, matiere: any): Observable<any> {
    return this.http.put<any>(`${environment.baseUrl}matieres/${matiereId}`, matiere);
  }

  /**
   * Supprime une matière
   * DELETE /api/matieres/{id}
   */
  deleteMatiere(matiereId: any): Observable<any> {
    return this.http.delete<any>(`${environment.baseUrl}matieres/${matiereId}`);
  }
}