import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Salle {
  id: number;
  nom: string;
  capacite: number;
  description?: string;
  type?: string;
  equipements?: Array<{
    id: number;
    nom: string;
    type: string;
  }>;
  created_at?: string;
  updated_at?: string;
}

export interface CreateSalleRequest {
  nom: string;
  capacite: number;
  description?: string;
  type?: string;
  equipements?: number[];
}

export interface UpdateSalleRequest {
  nom?: string;
  capacite?: number;
  description?: string;
  type?: string;
  equipements?: number[];
}

export interface SalleDisponibilite {
  salle_id: number;
  date_debut: string;
  date_fin: string;
  disponible: boolean;
  conflits?: Array<{
    id: number;
    titre: string;
    date_debut: string;
    date_fin: string;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class SalleService {

  constructor(private http: HttpClient) {}

  /**
   * Récupère toutes les salles
   */
  getSalles(): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}salles/all`);
  }

  /**
   * Récupère une salle par son ID
   */
  getSalle(id: number): Observable<Salle> {
    return this.http.get<Salle>(`${environment.baseUrl}salles/${id}`);
  }

  /**
   * Crée une nouvelle salle
   */
  createSalle(salleData: CreateSalleRequest): Observable<Salle> {
    return this.http.post<Salle>(`${environment.baseUrl}salles/create`, salleData);
  }

  /**
   * Met à jour une salle existante
   */
  updateSalle(id: number, salleData: UpdateSalleRequest): Observable<Salle> {
    return this.http.put<Salle>(`${environment.baseUrl}salles/${id}`, salleData);
  }

  /**
   * Supprime une salle
   */
  deleteSalle(id: number): Observable<any> {
    return this.http.delete(`${environment.baseUrl}salles/${id}`);
  }

  /**
   * Recherche des salles par nom
   */
  searchSalles(query: string): Observable<any> {
    const params = new HttpParams().set('search', query);
    return this.http.get<any>(`${environment.baseUrl}salles/all`, { params });
  }

  /**
   * Récupère les salles avec leurs équipements
   */
  getSallesWithEquipements(): Observable<any> {
    const params = new HttpParams().set('with_equipements', 'true');
    return this.http.get<any>(`${environment.baseUrl}salles/all`, { params });
  }

  /**
   * Vérifie la disponibilité d'une salle pour une période donnée
   */
  checkDisponibilite(salleId: number, dateDebut: string, dateFin: string): Observable<SalleDisponibilite> {
    const params = new HttpParams()
      .set('date_debut', dateDebut)
      .set('date_fin', dateFin);
    return this.http.get<SalleDisponibilite>(`${environment.baseUrl}salles/${salleId}/disponibilite`, { params });
  }

  /**
   * Récupère les salles disponibles pour une période donnée
   */
  getSallesDisponibles(dateDebut: string, dateFin: string): Observable<any> {
    const params = new HttpParams()
      .set('date_debut', dateDebut)
      .set('date_fin', dateFin);
    return this.http.get<any>(`${environment.baseUrl}salles/disponibles`, { params });
  }

  /**
   * Récupère les salles par capacité minimale
   */
  getSallesByCapacite(capaciteMin: number): Observable<any> {
    const params = new HttpParams().set('capacite_min', capaciteMin.toString());
    return this.http.get<any>(`${environment.baseUrl}salles/all`, { params });
  }

  /**
   * Récupère les salles par type
   */
  getSallesByType(type: string): Observable<any> {
    const params = new HttpParams().set('type', type);
    return this.http.get<any>(`${environment.baseUrl}salles/all`, { params });
  }

  /**
   * Récupère les statistiques des salles
   */
  getSallesStats(): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}salles/stats`);
  }
}
