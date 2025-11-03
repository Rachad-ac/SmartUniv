import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class FiliereService {

  constructor(private http: HttpClient) {}

  /**
   * Récupère toutes les filières
   */
  getFilieres(): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}filieres/all`);
  }

  /**
   * Récupère une filière par son ID
   */
  getFiliere(id: number): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}filieres/${id}`);
  }

  /**
   * Crée une nouvelle filière
   */
  createFiliere(filiereData: any): Observable<any> {
    return this.http.post<any>(`${environment.baseUrl}filieres/create`, filiereData);
  }

  /**
   * Met à jour une filière existante
   */
  updateFiliere(id: number, filiereData: any): Observable<any> {
    return this.http.put<any>(`${environment.baseUrl}filieres/${id}`, filiereData);
  }

  /**
   * Supprime une filière
   */
  deleteFiliere(id: number): Observable<any> {
    return this.http.delete(`${environment.baseUrl}filieres/${id}`);
  }

  /**
   * Recherche des filières par nom
   */
  searchFilieres(query: string): Observable<any> {
    const params = new HttpParams().set('search', query);
    return this.http.get<any>(`${environment.baseUrl}filieres/all`, { params });
  }

  /**
   * Récupère les filières avec leurs classes
   */
  getFilieresWithClasses(): Observable<any> {
    const params = new HttpParams().set('with_classes', 'true');
    return this.http.get<any>(`${environment.baseUrl}filieres/all`, { params });
  }

  /**
   * Récupère les statistiques des filières
   */
  getFilieresStats(): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}filieres/stats`);
  }
}
