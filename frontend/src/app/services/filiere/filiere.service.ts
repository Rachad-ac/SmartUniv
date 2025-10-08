import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Filiere {
  id: number;
  nom: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
  classes?: Array<{
    id: number;
    nom: string;
  }>;
}

export interface CreateFiliereRequest {
  nom: string;
  description?: string;
}

export interface UpdateFiliereRequest {
  nom?: string;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FiliereService {

  constructor(private http: HttpClient) {}

  /**
   * Récupère toutes les filières
   */
  getFilieres(): Observable<Filiere[]> {
    return this.http.get<Filiere[]>(`${environment.baseUrl}filieres/all`);
  }

  /**
   * Récupère une filière par son ID
   */
  getFiliere(id: number): Observable<Filiere> {
    return this.http.get<Filiere>(`${environment.baseUrl}filieres/${id}`);
  }

  /**
   * Crée une nouvelle filière
   */
  createFiliere(filiereData: CreateFiliereRequest): Observable<Filiere> {
    return this.http.post<Filiere>(`${environment.baseUrl}filieres/create`, filiereData);
  }

  /**
   * Met à jour une filière existante
   */
  updateFiliere(id: number, filiereData: UpdateFiliereRequest): Observable<Filiere> {
    return this.http.put<Filiere>(`${environment.baseUrl}filieres/${id}`, filiereData);
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
  searchFilieres(query: string): Observable<Filiere[]> {
    const params = new HttpParams().set('search', query);
    return this.http.get<Filiere[]>(`${environment.baseUrl}filieres/all`, { params });
  }

  /**
   * Récupère les filières avec leurs classes
   */
  getFilieresWithClasses(): Observable<Filiere[]> {
    const params = new HttpParams().set('with_classes', 'true');
    return this.http.get<Filiere[]>(`${environment.baseUrl}filieres/all`, { params });
  }

  /**
   * Récupère les statistiques des filières
   */
  getFilieresStats(): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}filieres/stats`);
  }
}
