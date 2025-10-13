import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {}

  /**
   * Récupère tous les utilisateurs
   * GET /api/users/all
   */
  getUsers(): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}users/all`);
  }

  /**
   * Recherche d'utilisateurs avec critères
   * GET /api/users/search?nom=&prenom=&email=&role_id=
   */
  searchUsers(criteria: any): Observable<any> {
    let params = new HttpParams();

    for (const key in criteria) {
        if (criteria.hasOwnProperty(key) && criteria[key] !== null && criteria[key] !== '') {
            params = params.set(key, criteria[key]);
        }
    }
    
    return this.http.get(`${environment.baseUrl}users/search`, { params: params });
  }

  /**
   * Récupère un utilisateur par ID
   * GET /api/users/{id}
   */
  getUserById(userId: any): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}users/${userId}`);
  }

  /**
   * Supprime un utilisateur
   * DELETE /api/users/{id}
   */
  deleteUser(userId: any): Observable<any> {
    return this.http.delete<any>(`${environment.baseUrl}users/${userId}`);
  }

  /**
   * Met à jour un utilisateur
   * PUT /api/users/{id}
   */
  updateUser(userId: any, user: any): Observable<any> {
    return this.http.put<any>(`${environment.baseUrl}users/${userId}`, user);
  }

  /**
   * Récupère tous les rôles disponibles
   * GET /api/roles/all
   */
  getRoles(): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}roles/all`);
  }
}
