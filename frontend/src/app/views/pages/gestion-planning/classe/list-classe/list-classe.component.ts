import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// Services assumés pour la gestion des classes et des filières
import { ClasseService } from 'src/app/services/classe/classe.service';
import { FiliereService } from 'src/app/services/filiere/filiere.service';
import { Alertes } from 'src/app/util/alerte';

@Component({
  selector: 'app-list-classe',
  templateUrl: './list-classe.component.html',
  styleUrls: ['./list-classe.component.scss']
})
export class ListClasseComponent implements OnInit {

  displayedColumns: string[] = [
    'nom',
    'niveau',
    'effectif',
    'filiere', // Nom de la filière
    'actions'
  ];

  classeToUpdate: any;
  pageOptions: any = { page: 0, size: 10 };
  dataSource: any;
  rows: any[] = []; // Si une librairie de tableau utilise 'rows'
  total = 0;
  loadingIndicator = true;
  searchTerm: string = '';
  filieres: any[] = []; // Utilisé pour mapper l'ID de filière au nom

  constructor(
    private modalService: NgbModal,
    // Note: Assurez-vous que ces services sont définis
    // et importés correctement dans votre environnement Angular
    private classeService: ClasseService,
    private filiereService: FiliereService 
  ) {}

  ngOnInit(): void {
    this.loadFilieres();
    // Le chargement des classes est lancé après le chargement des filières (ou peut être parallèle)
    this.getAllClasses(); 
  }

  /**
   * Charge la liste complète des filières pour l'affichage (mapping) et la recherche
   */
  loadFilieres(): void {
    this.filiereService.getFilieres().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.filieres = response.data.map((filiere: any) => ({
            value: filiere.id_filiere, // Assurez-vous que c'est le bon champ d'ID
            label: filiere.nom
          }));
        }
      },
      error: (err) => {
        console.error('Erreur lors du chargement des filières', err);
        // Filières par défaut ou gestion d'erreur
      }
    });
  }


  /**
   * Charge toutes les classes
   */
  getAllClasses(): void {
    this.loadingIndicator = true;
    this.classeService.getClasses().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.dataSource = { 
            payload: response.data || [], 
            metadata: { totalElements: response.data?.length || 0 } 
          };
          // Mappe la filière sur chaque classe si non déjà fait par le backend
          this.dataSource.payload = this.dataSource.payload.map((classe: any) => ({
            ...classe,
            filiereName: this.getFiliereName(classe.id_filiere) // Utilise le helper
          }));

        } else {
          this.dataSource = { payload: [], metadata: { totalElements: 0 } };
          Alertes.alerteAddDanger(response.message || 'Erreur lors du chargement des classes');
        }
        this.loadingIndicator = false;
      },
      error: err => {
        console.error('Erreur lors du chargement des classes', err);
        Alertes.alerteAddDanger('Erreur lors du chargement des classes');
        this.loadingIndicator = false;
      }
    });
  }

  /**
   * Gestion de la pagination (à implémenter si l'API le supporte)
   */
  paginate($event: number): void {
    this.loadingIndicator = true;
    this.pageOptions.page = $event - 1;
    this.getAllClasses();
  }

  /**
   * Ouvre le modal d'ajout de classe
   */
  openAddClasse(content: TemplateRef<any>): void {
    this.openModal(content, 'lg');
  }

  /**
   * Ouvre le modal d'édition de classe
   */
  openEditClasse(content: TemplateRef<any>, classe: any): void {
    this.classeToUpdate = classe;
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

  /**
   * Supprime une classe
   */
  deleteClasse(classe: any): void {
    // NOTE: Utilisation d'une alerte custom pour la confirmation
    Alertes.confirmAction( 
      'Voulez-vous supprimer cette classe ?',
      `La classe ${classe.nom} sera définitivement supprimée.`,
      () => {
        this.classeService.deleteClasse(classe.id_classe).subscribe({
          next: (response: any) => {
            if (response.success) {
              Alertes.alerteAddSuccess('Classe supprimée avec succès');
              this.getAllClasses();
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

  refresh(): void {
    this.getAllClasses();
  }

  /**
   * Ferme tous les modals et rafraîchit la liste
   */
  close(): void {
    this.modalService.dismissAll();
    this.getAllClasses();
  }

  /**
   * Effectue une recherche de classes
   */
  doSearch(criteria: any): void {
    if (Object.keys(criteria).length === 0 || this.isEmptySearch(criteria)) {
      this.getAllClasses();
      return;
    }

    this.loadingIndicator = true;
    this.classeService.searchClasses(criteria).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.dataSource = { 
            payload: response.data || [], 
            metadata: { totalElements: response.data?.length || 0 } 
          };
          this.dataSource.payload = this.dataSource.payload.map((classe: any) => ({
            ...classe,
            filiereName: this.getFiliereName(classe.id_filiere) 
          }));
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

  /**
   * Obtient le nom de la filière à partir de l'ID
   */
  getFiliereName(filiereId: number): string {
    const filiere = this.filieres.find(f => f.value === filiereId);
    return filiere ? filiere.label : 'Inconnue';
  }

  /**
   * Obtient la classe CSS pour le niveau (exemple simple)
   */
  getLevelClass(niveau: string): string {
    switch (niveau?.toUpperCase()) {
      case 'L1':
      case 'M1': return 'badge bg-success';
      case 'L2':
      case 'M2': return 'badge bg-primary';
      case 'L3': return 'badge bg-warning';
      default: return 'badge bg-secondary';
    }
  }
}
