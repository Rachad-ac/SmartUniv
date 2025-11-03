import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CoursService {

  constructor(private http: HttpClient) {}

  /**
   * Récupère tous les cours
   */
  getCours(): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}cours/all`);
  }

  /**
   * Récupère un cours par son ID
   */
  getCoursById(id: any): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}cours/${id}`);
  }

  /**
   * Crée un nouveau cours
   */
  createCours(coursData: any): Observable<any> {
    return this.http.post<any>(`${environment.baseUrl}cours/create`, coursData);
  }

  /**
   * Met à jour un cours existant
   */
  updateCours(id: any, coursData: any): Observable<any> {
    return this.http.put<any>(`${environment.baseUrl}cours/${id}`, coursData);
  }

  /**
   * Supprime un cours
   */
  deleteCours(id: any): Observable<any> {
    return this.http.delete(`${environment.baseUrl}cours/${id}`);
  }

  /**
   * Recherche des cours par titre
   */
  searchCours(query: any): Observable<any> {
    const params = new HttpParams().set('search', query);
    return this.http.get<any>(`${environment.baseUrl}cours/all`, { params });
  }

  /**
   * Récupère les cours d'une matière spécifique
   */
  getCoursByMatiere(matiereId: any): Observable<any> {
    const params = new HttpParams().set('matiere_id', matiereId.toString());
    return this.http.get<any>(`${environment.baseUrl}cours/all`, { params });
  }

  /**
   * Récupère les cours avec leurs matières
   */
  getCoursWithMatieres(): Observable<any> {
    const params = new HttpParams().set('with_matieres', 'true');
    return this.http.get<any>(`${environment.baseUrl}cours/all`, { params });
  }

  /**
   * Récupère les statistiques des cours
   */
  getCoursStats(): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}cours/stats`).pipe(map(res => res.data));
  }
}
