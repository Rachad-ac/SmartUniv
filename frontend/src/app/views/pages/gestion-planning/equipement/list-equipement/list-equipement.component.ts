import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Alertes } from 'src/app/util/alerte';
import { EquipementService } from 'src/app/services/equipement/equipement.service';
import { SalleService } from 'src/app/services/salle/salle.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-list-equipement',
  templateUrl: './list-equipement.component.html',
  styleUrls: ['./list-equipement.component.scss']
})
export class ListEquipementComponent implements OnInit {

  displayedColumns: string[] = [
    'nom',
    'quantite',
    'description',
    'salle',
    'actions'
  ];

  equipementToUpdate: any;
  // Correction: Ajout de 'page' pour suivre la page courante lors de la recherche
  pageOptions: any = { page: 0, size: 10 }; 
  dataSource: any;
  rows: any[] = [];
  total = 0;
  loadingIndicator = true;
  searchTerm: string = '';
  salles: any[] = [];
  id_salle : any;
  
  // Ajout de la variable pour stocker les critères de recherche actifs
  activeSearchCriteria: any = {}; 

  constructor(
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private equipementService: EquipementService,
    private salleService: SalleService
  ) {}

  ngOnInit(): void {
    this.id_salle = this.route.snapshot.paramMap.get('id_salle');
    // Appel initial avec les critères de pagination par défaut
    this.getAllEquipements(this.id_salle); 
    this.loadSalles();
  }

  /**
   * Charge tous les équipements (ou selon la pagination/recherche active)
   * Le nom de la méthode reste 'getAllEquipements' mais elle peut intégrer la recherche active
   */
  getAllEquipements(id :any): void {
    this.loadingIndicator = true;
    
    // Déterminer la méthode de service à appeler et les critères
    const criteria = { ...this.activeSearchCriteria, ...this.pageOptions };
    const observable = (Object.keys(this.activeSearchCriteria).length === 0)
      ? this.equipementService.getEquipmentById(id) // Si pas de recherche active, utilise getUsers/getEquipments
      : this.equipementService.searchEquipments(criteria); // Si recherche active, utilise searchUsers/searchEquipments

    observable.subscribe({
      next: (response: any) => {
        if (response.success) {
          this.dataSource = { 
            payload: response.data || [], 
            metadata: { totalElements: response.data?.length || 0 } 
          };
        } else {
          this.dataSource = { payload: [], metadata: { totalElements: 0 } };
          Alertes.alerteAddDanger(response.message || 'Erreur lors du chargement des équipements');
        }
        this.loadingIndicator = false;
      },
      error: err => {
        console.error('Erreur lors du chargement des équipements', err);
        Alertes.alerteAddDanger('Erreur lors du chargement des équipements');
        this.loadingIndicator = false;
      }
    });
  }

  /**
   * Charge la liste des salles disponibles
   * (Logique identique à loadRoles dans ListeUsersComponent)
   */
  loadSalles(): void {
    this.salleService.getSalles().subscribe({
      next: (response: any) => {
        if (response.success) {
          console.log('salles' , response.data)
          this.salles = response.data.map((salle: any) => ({
            value: salle.id_salle,
            label: salle.nom
          }));
        }
      },
      error: (err) => {
        console.error('Erreur lors du chargement des salles', err);
      }
    });
  }

  /**
   * Gestion de la pagination (Logique identique à paginate dans ListeUsersComponent)
   * Applique le changement de page et relance getAllEquipements qui gère la recherche active
   */
  paginate($event: number): void {
    this.loadingIndicator = true;
    this.pageOptions.page = $event - 1;
    this.getAllEquipements(this.id_salle); // Relance le chargement avec les nouvelles options de page
  }
  
  // --- Modals (identique à ListeUsersComponent) ---

  /**
   * Ouvre le modal d'ajout d'équipement
   */
  openAddEquipement(content: TemplateRef<any>): void {
    this.openModal(content, 'lg');
  }

  /**
   * Ouvre le modal d'édition d'équipement
   */
  openEditEquipement(content: TemplateRef<any>, equipement: any): void {
    this.equipementToUpdate = equipement;
    this.openModal(content, 'lg');
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

  // --- Suppression (identique à ListeUsersComponent) ---

  /**
   * Supprime un équipement
   */
  deleteEquipement(equipement: any): void {
    Alertes.confirmAction(
      'Voulez-vous supprimer cet équipement ?',
      `L'équipement ${equipement.nom} sera définitivement supprimé`,
      () => {
        this.equipementService.deleteEquipment(equipement.id).subscribe({
          next: (response: any) => {
            if (response.success) {
              Alertes.alerteAddSuccess('Équipement supprimé avec succès');
              this.getAllEquipements(this.id_salle);
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

  // --- Recherche et Rafraîchissement (Logique identique à ListeUsersComponent) ---

  /**
   * Rafraîchit la liste
   */
  refresh(): void {
    // Réinitialise les critères de recherche et recharge tout
    this.activeSearchCriteria = {};
    this.pageOptions.page = 0;
    this.getAllEquipements(this.id_salle);
  }

  /**
   * Ferme tous les modals et rafraîchit la liste
   */
  close(): void {
    this.modalService.dismissAll();
    this.getAllEquipements(this.id_salle);
  }

  /**
   * Effectue une recherche d'équipements (doSearch)
   * Met à jour les critères de recherche actifs.
   */
  doSearch(criteria: any): void {
    if (Object.keys(criteria).length === 0 || this.isEmptySearch(criteria)) {
      this.getAllEquipements(this.id_salle);
      return;
    }

    this.loadingIndicator = true;
    this.equipementService.searchEquipments(criteria).subscribe({
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

  

  /**
   * Vérifie si les critères de recherche sont vides
   */
  private isEmptySearch(criteria: any): boolean {
    return Object.values(criteria).every(value => 
      value === null || value === undefined || value === ''
    );
  }

  // --- Utilitaires ---

  /**
   * Retourne le nom d'une salle à partir de son ID
   * (Logique identique à getRoleName dans ListeUsersComponent)
   */
  getSalleName(idSalle: number): string {
    const salle = this.salles.find(s => s.value === idSalle);
    return salle ? salle.label : 'Non définie';
  }

  /**
   * Ajout d'une méthode pour simuler getStatusClass/getRoleClass, si l'équipement a un statut/type à styliser.
   * Ici, nous stylisons en fonction de la quantité pour l'exemple.
   */
  getQuantityClass(quantite: number): string {
    if (quantite > 10) return 'text-success fw-bold';
    if (quantite > 0) return 'text-warning';
    return 'text-danger fw-bold';
  }

  /**
   * Simule getRoleClass pour le type d'équipement (si applicable, sinon basé sur la salle)
   */
  getSalleClass(salleName: string): string {
    switch (salleName?.toLowerCase()) {
      case 'laboratoire': return 'text-danger fw-bold';
      case 'amphithéâtre': return 'text-primary fw-bold';
      case 'salle de cours': return 'text-success';
      default: return 'text-secondary';
    }
  }
}