import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';

// Shape côté frontend, avec id normalisé
export interface Cours {
  id: number;
  nom: string;
  code: string;
  description?: string;
  id_matiere: number;
  id_filiere: number;
  matiere?: { id: number; nom: string };
  filiere?: { id: number; nom: string };
  created_at?: string;
  updated_at?: string;
}

// Shape renvoyée par le backend (id_cours, id_matiere/id_filiere comme PKs spécifiques)
interface BackendCours {
  id_cours: number;
  nom: string;
  code: string;
  description?: string;
  id_matiere: number;
  id_filiere: number;
  matiere?: { id_matiere: number; nom: string };
  filiere?: { id_filiere: number; nom: string };
  created_at?: string;
  updated_at?: string;
}

interface ApiItemResponse<T> { message: string; data: T }
interface ApiListResponse<T> { message: string; data: T[] }

export interface CreateCoursRequest {
  nom: string;
  code: string;
  description?: string;
  id_matiere: number;
  id_filiere: number;
}

export interface UpdateCoursRequest {
  nom?: string;
  code?: string;
  description?: string;
  id_matiere?: number;
  id_filiere?: number;
}

@Injectable({
  providedIn: 'root'
})
export class CoursService {

  constructor(private http: HttpClient) {}

  private adapt(c: BackendCours): Cours {
    return {
      id: c.id_cours,
      nom: c.nom,
      code: c.code,
      description: c.description,
      id_matiere: c.id_matiere,
      id_filiere: c.id_filiere,
      matiere: c.matiere ? { id: c.matiere.id_matiere, nom: c.matiere.nom } : undefined,
      filiere: c.filiere ? { id: c.filiere.id_filiere, nom: c.filiere.nom } : undefined,
      created_at: c.created_at,
      updated_at: c.updated_at,
    };
  }

  /**
   * Récupère tous les cours
   */
  getCours(): Observable<Cours[]> {
    return this.http
      .get<ApiListResponse<BackendCours>>(`${environment.baseUrl}cours/all`)
      .pipe(map(res => res.data.map(c => this.adapt(c))));
  }

  /**
   * Récupère un cours par son ID
   */
  getCoursById(id: number): Observable<Cours> {
    return this.http
      .get<ApiItemResponse<BackendCours>>(`${environment.baseUrl}cours/${id}`)
      .pipe(map(res => this.adapt(res.data)));
  }

  /**
   * Crée un nouveau cours
   */
  createCours(coursData: CreateCoursRequest): Observable<Cours> {
    return this.http
      .post<ApiItemResponse<BackendCours>>(`${environment.baseUrl}cours/create`, coursData)
      .pipe(map(res => this.adapt(res.data)));
  }

  /**
   * Met à jour un cours existant
   */
  updateCours(id: number, coursData: UpdateCoursRequest): Observable<Cours> {
    return this.http
      .put<ApiItemResponse<BackendCours>>(`${environment.baseUrl}cours/${id}`, coursData)
      .pipe(map(res => this.adapt(res.data)));
  }

  /**
   * Supprime un cours
   */
  deleteCours(id: number): Observable<any> {
    return this.http.delete(`${environment.baseUrl}cours/${id}`);
  }

  /**
   * Recherche des cours par titre
   */
  searchCours(query: string): Observable<Cours[]> {
    const params = new HttpParams().set('search', query);
    return this.http
      .get<ApiListResponse<BackendCours>>(`${environment.baseUrl}cours/all`, { params })
      .pipe(map(res => res.data.map(c => this.adapt(c))));
  }

  /**
   * Récupère les cours d'une matière spécifique
   */
  getCoursByMatiere(matiereId: number): Observable<Cours[]> {
    const params = new HttpParams().set('matiere_id', matiereId.toString());
    return this.http
      .get<ApiListResponse<BackendCours>>(`${environment.baseUrl}cours/all`, { params })
      .pipe(map(res => res.data.map(c => this.adapt(c))));
  }

  /**
   * Récupère les cours avec leurs matières
   */
  getCoursWithMatieres(): Observable<Cours[]> {
    const params = new HttpParams().set('with_matieres', 'true');
    return this.http
      .get<ApiListResponse<BackendCours>>(`${environment.baseUrl}cours/all`, { params })
      .pipe(map(res => res.data.map(c => this.adapt(c))));
  }

  /**
   * Récupère les statistiques des cours
   */
  getCoursStats(): Observable<any> {
    return this.http.get<ApiItemResponse<any>>(`${environment.baseUrl}cours/stats`).pipe(map(res => res.data));
  }
}
