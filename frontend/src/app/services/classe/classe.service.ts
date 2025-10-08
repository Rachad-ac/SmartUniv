import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


export interface CreateClasseRequest {
  nom: string;
  id_filiere: number;
}

export interface UpdateClasseRequest {
  nom?: string;
  id_filiere?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ClasseService {

  constructor(private http: HttpClient) {}

  /**
   * Récupère toutes les classes
   */
  getClasses(): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}classes/all`);
  }

  /**
   * Récupère les classes d'une filière spécifique
   */
  getClassesByFiliere(filiereId: number): Observable<any> {
    const params = new HttpParams().set('filiere_id', filiereId.toString());
    return this.http.get<any>(`${environment.baseUrl}classes/all`, { params });
  }

  /**
   * Récupère une classe par son ID
   */
  getClasse(id: number): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}classes/${id}`);
  }

  /**
   * Crée une nouvelle classe
   */
  createClasse(classeData: CreateClasseRequest): Observable<any> {
    return this.http.post<any>(`${environment.baseUrl}classes/create`, classeData);
  }

  /**
   * Met à jour une classe existante
   */
  updateClasse(id: number, classeData: UpdateClasseRequest): Observable<any> {
    return this.http.put<any>(`${environment.baseUrl}classes/${id}`, classeData);
  }

  /**
   * Supprime une classe
   */
  deleteClasse(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.baseUrl}classes/${id}`);
  }

  /**
   * Recherche des classes par nom
   */
  searchClasses(query: string): Observable<any> {
    const params = new HttpParams().set('search', query);
    return this.http.get<any>(`${environment.baseUrl}classes/all`, { params });
  }

  /**
   * Récupère les statistiques des classes
   */
  getClassesStats(): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}classes/stats`);
  }
}
