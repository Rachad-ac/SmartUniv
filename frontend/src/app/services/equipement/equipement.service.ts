import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EquipementService {

  // Inject the HttpClient module
  constructor(private http: HttpClient) { }

  /**
   * Récupère tous les équipements
   * GET /api/equipments/all
   */
  getEquipments(): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}equipements/all`);
  }

  /**
   * Recherche d'équipements avec critères
   * GET /api/equipments/search?nom=&type=&localisation=
   */
  searchEquipments(criteria: any): Observable<any> {
    let params = new HttpParams();

    for (const key in criteria) {
        // Check if the property exists, is not null, and is not an empty string
        if (criteria.hasOwnProperty(key) && criteria[key] !== null && criteria[key] !== '') {
            params = params.set(key, criteria[key]);
        }
    }
    
    // The second argument of http.get is an options object, where 'params' is set.
    return this.http.get(`${environment.baseUrl}equipements/search`, { params: params });
  }

  /**
   * Récupère un équipement par ID
   * GET /api/equipements/{id}
   */
  getEquipmentById(equipmentId: any): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}equipements/${equipmentId}`);
  }

  /**
   * Crée un nouvel équipement (Ajouté car c'est une opération CRUD standard)
   * POST /api/equipements
   */
  createEquipment(equipment: any): Observable<any> {
    // Assuming a POST request is used for creation, without an ID in the URL.
    return this.http.post<any>(`${environment.baseUrl}equipements`, equipment);
  }


  /**
   * Met à jour un équipement
   * PUT /api/equipements/{id}
   */
  updateEquipment(equipmentId: any, equipment: any): Observable<any> {
    return this.http.put<any>(`${environment.baseUrl}equipements/${equipmentId}`, equipment);
  }

  /**
   * Supprime un équipement
   * DELETE /api/equipements/{id}
   */
  deleteEquipment(equipmentId: any): Observable<any> {
    return this.http.delete<any>(`${environment.baseUrl}equipements/${equipmentId}`);
  }

  /**
   * Récupère tous les types d'équipement disponibles (Analogue à getRoles())
   * GET /api/equipment-types/all
   */
  getEquipmentTypes(): Observable<any> {
    // Assuming there's a separate endpoint for equipment types/categories
    return this.http.get<any>(`${environment.baseUrl}equipment-types/all`);
  }
}