import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// ATTENTION : Ce service n'existe pas encore, il faudra le créer
import { SalleService } from 'src/app/services/salle/salle.service'; 
import { Alertes } from 'src/app/util/alerte';

@Component({
  selector: 'app-list-salle',
  templateUrl: './list-salle.component.html',
  styleUrls: ['./list-salle.component.scss']
})
export class ListSalleComponent implements OnInit {

  // Les colonnes affichées dans le tableau (basées sur les champs fillable du modèle Salle)
  displayedColumns: string[] = [
    'nom',
    'type_salle',
    'capacite',
    'localisation',
    'etat',
    'equipements',
    'actions'
  ];

  salleToUpdate: any;
  @Input() salleToEquipements: any;
  salleToReservations: any;
  pageOptions: any = { page: 0, size: 10 };
  dataSource: any;
  rows: any[] = [];
  total = 0;
  loadingIndicator = true;
  searchTerm: string = '';
  equipements: any[] = [];
  reservations: any[] = [];
  equipementId : any;
  
  // Les types de salles, si votre application les gère de manière fixe (à charger si nécessaire)
  typesSalles: any[] = []; 

  constructor(
    private modalService: NgbModal,
    private router : Router,
    private salleService: SalleService 
  ) {}

  ngOnInit(): void {
    this.getAllSalles();
    // this.loadTypesSalles(); // Décommenter si nécessaire de charger les types
  }

  // -------------------------
  // Opérations CRUD et Données
  // -------------------------

  /**
   * Charge toutes les salles
   */
  getAllSalles(): void {
    this.loadingIndicator = true;
    this.salleService.getSalles().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.dataSource = { 
            payload: response.data || [], 
            metadata: { totalElements: response.data?.length || 0 } 
          };
        } else {
          this.dataSource = { payload: [], metadata: { totalElements: 0 } };
          Alertes.alerteAddDanger(response.message || 'Erreur lors du chargement des salles');
        }
        this.loadingIndicator = false;
      },
      error: err => {
        console.error('Erreur lors du chargement des salles', err);
        Alertes.alerteAddDanger('Erreur lors du chargement des salles');
        this.loadingIndicator = false;
      }
    });
  }

  /**
   * Charge les équipements d'une salle
   */
  getEquipements(salle: any): void {
   this.salleService.getSallesWithEquipements().subscribe({
    next: (response: any) => {
      if (response.success) {
        this.equipements = response.data;
      }
    }
   });
   
  }

  /**
   * Supprime une salle
   */
  deleteSalle(salle: any): void {
    Alertes.confirmAction(
      'Voulez-vous supprimer cette salle ?',
      `La salle ${salle.nom} sera définitivement supprimée, ainsi que toutes ses liaisons (réservations, équipements...).`,
      () => {
        this.salleService.deleteSalle(salle.id_salle).subscribe({ // Utilisation de id_salle
          next: (response: any) => {
            if (response.success) {
              Alertes.alerteAddSuccess('Salle supprimée avec succès');
              this.getAllSalles();
            } else {
              Alertes.alerteAddDanger(response.message || 'Erreur lors de la suppression');
            }
          },
          error: (err) => {
            Alertes.alerteAddDanger(err?.error?.message || 'Erreur lors de la suppression');
          }
        });
      }
    );
  }

  /**
   * Effectue une recherche de salles
   */
  doSearch(criteria: any): void {
    if (Object.keys(criteria).length === 0 || this.isEmptySearch(criteria)) {
      this.getAllSalles();
      return;
    }

    this.loadingIndicator = true;
    this.salleService.searchSalles(criteria).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.dataSource = { 
            payload: response.data || [], 
            metadata: { totalElements: response.data?.length || 0 } 
          };
          this.modalService.dismissAll();
        } else {
          this.dataSource = { payload: [], metadata: { totalElements: 0 } };
          Alertes.alerteAddDanger(response.message || 'Aucun résultat trouvé');
        }
        this.loadingIndicator = false;
      },
      error: (err) => {
        console.error("Erreur de recherche", err);
        Alertes.alerteAddDanger('Erreur lors de la recherche');
        this.loadingIndicator = false;
      }
    });
  }

  // -------------------------
  // Gestion de l'Interface
  // -------------------------
  
  /**
   * Gestion de la pagination (basé sur l'index de page)
   */
  paginate($event: number): void {
    this.loadingIndicator = true;
    this.pageOptions.page = $event - 1;
    this.getAllSalles();
  }

  refresh(): void {
    this.getAllSalles();
  }

  detailSalle(id: number) {

    if (!id) {

      console.error('⚠️ ID non défini');
      return;
    }

    this.router.navigate(['admin/gestion-planning/salles/equipements', id]);
  }

  /**
   * Ouvre le modal d'ajout de salle
   */
  openAddSalle(content: TemplateRef<any>): void {
    this.openModal(content, 'lg');
  }

  /**
   * Ouvre le modal d'édition de salle
   */
  openEditSalle(content: TemplateRef<any>, salle: any): void {
    this.salleToUpdate = salle;
    this.openModal(content, 'lg');
  }

  /**
   * Ouvre le modal d'équipements
   */
  openEquipements(content: TemplateRef<any>, salle: any): void {
    this.salleToEquipements = salle
    this.openModal(content, 'lg');
  }

  /**
   * Ouvre le modal de réservations
   */
  openReservations(content: TemplateRef<any>, salle: any): void {
    this.openModal(content, 'xl');
  }

  /**
   * Ouvre un modal générique
   */
  openModal(content: TemplateRef<any>, size: 'md' | 'sm' | 'lg' | 'xl'): void {
    this.modalService.open(content, { size, backdrop: 'static'}).result.then(
      () => {},
      () => {}
    );
  }

  /**
   * Ferme tous les modals et rafraîchit les données
   */
  close(): void {
    this.modalService.dismissAll();
    this.getAllSalles();
  }
  
  // -------------------------
  // Helpers
  // -------------------------

  /**
   * Vérifie si les critères de recherche sont vides
   */
  private isEmptySearch(criteria: any): boolean {
    return Object.values(criteria).every(value => 
      value === null || value === undefined || value === ''
    );
  }

  /**
   * Obtient la classe CSS pour l'état de la salle
   */
  getStatusClass(etat: string): string {
    switch (etat?.toLowerCase()) {
      case 'disponible': return 'text-success';
      case 'occupée': 
      case 'occupee': return 'text-warning';
      case 'maintenance': return 'text-danger';
      default: return 'text-secondary';
    }
  }
}