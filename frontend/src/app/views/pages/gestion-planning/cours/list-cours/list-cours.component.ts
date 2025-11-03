import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Alertes } from 'src/app/util/alerte';
// Services assumés pour la gestion des cours et des données associées
import { CoursService } from 'src/app/services/cours/cours.service';
import { FiliereService } from 'src/app/services/filiere/filiere.service';
import { MatiereService } from 'src/app/services/matiere/matiere.service';

@Component({
  selector: 'app-list-cours',
  templateUrl: './list-cours.component.html',
  styleUrls: ['./list-cours.component.scss']
})
export class ListCoursComponent implements OnInit {

  displayedColumns: string[] = [
    'nom',
    'code',
    'filiere',
    'matiere',
    'semestre',
    'volume_horaire',
    'actions'
  ];

  coursToUpdate: any;
  pageOptions: any = { page: 0, size: 10 };
  dataSource: any;
  loadingIndicator = true;
  activeSearchCriteria: any = {};

  // Données de référence pour les filtres et l'affichage
  filieres: any[] = [];
  matieres: any[] = [];

  constructor(
    private modalService: NgbModal,
    // Injection des services assumés
    private coursService: CoursService,
    private filiereService: FiliereService,
    private matiereService: MatiereService
  ) {}

  ngOnInit(): void {
    this.getAllCours();
    this.loadFilieres();
    this.loadMatieres();
  }

  /**
   * Charge tous les cours (ou selon la pagination/recherche active)
   */
  getAllCours(): void {
    this.loadingIndicator = true;

    // Déterminer la méthode de service à appeler et les critères
    const criteria = { ...this.activeSearchCriteria, ...this.pageOptions };
    
    // Si pas de critères de recherche actifs, on appelle la méthode de base
    const observable = (Object.keys(this.activeSearchCriteria).length === 0)
      ? this.coursService.getCours() 
      : this.coursService.searchCours(criteria); 

    observable.subscribe({
      next: (response: any) => {
        if (response.success) {
          // IMPORTANT: Assurez-vous que le backend renvoie bien un tableau 'data'
          this.dataSource = { 
            payload: response.data || [], 
            metadata: { totalElements: response.data?.length || 0 } 
          };
        } else {
          this.dataSource = { payload: [], metadata: { totalElements: 0 } };
          Alertes.alerteAddDanger(response.message || 'Erreur lors du chargement des cours');
        }
        this.loadingIndicator = false;
      },
      error: err => {
        console.error('Erreur lors du chargement des cours', err);
        Alertes.alerteAddDanger('Erreur lors du chargement des cours');
        this.loadingIndicator = false;
      }
    });
  }

  /**
   * Charge la liste des filières disponibles
   */
  loadFilieres(): void {
    this.filiereService.getFilieres().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.filieres = response.data.map((filiere: any) => ({
            value: filiere.id_filiere,
            label: filiere.nom
          }));
        }
      },
      error: (err) => {
        console.error('Erreur lors du chargement des filières', err);
      }
    });
  }

  /**
   * Charge la liste des matières disponibles
   */
  loadMatieres(): void {
    this.matiereService.getMatieres().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.matieres = response.data.map((matiere: any) => ({
            value: matiere.id_matiere,
            label: matiere.nom
          }));
        }
      },
      error: (err) => {
        console.error('Erreur lors du chargement des matières', err);
      }
    });
  }

  /**
   * Gestion de la pagination
   */
  paginate($event: number): void {
    this.loadingIndicator = true;
    this.pageOptions.page = $event - 1;
    this.getAllCours(); 
  }

  // --- Modals ---

  /**
   * Ouvre le modal d'ajout ou de recherche de cours
   */
  openAddCours(content: TemplateRef<any>): void {
    this.openModal(content, 'lg');
  }

  /**
   * Ouvre le modal d'édition de cours
   */
  openEditCours(content: TemplateRef<any>, cours: any): void {
    this.coursToUpdate = cours;
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

  // --- Suppression ---

  /**
   * Supprime un cours
   */
  deleteCours(cours: any): void {
    Alertes.confirmAction(
      'Voulez-vous supprimer ce cours ?',
      `Le cours ${cours.nom} (${cours.code}) sera définitivement supprimé.`,
      () => {
        this.coursService.deleteCours(cours.id_cours).subscribe({
          next: (response: any) => {
            if (response.success) {
              Alertes.alerteAddSuccess('Cours supprimé avec succès');
              this.getAllCours();
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

  // --- Recherche et Rafraîchissement ---

  /**
   * Rafraîchit la liste en réinitialisant la recherche et la pagination
   */
  refresh(): void {
    this.activeSearchCriteria = {};
    this.pageOptions.page = 0;
    this.getAllCours();
  }

  /**
   * Ferme tous les modals et rafraîchit la liste
   */
  close(): void {
    this.modalService.dismissAll();
    this.getAllCours();
  }

  /**
   * Effectue une recherche de cours
   */
  doSearch(criteria: any): void {
    this.modalService.dismissAll(); // Ferme le modal de recherche

    if (Object.keys(criteria).length === 0 || this.isEmptySearch(criteria)) {
      this.activeSearchCriteria = {}; // Réinitialise la recherche
      this.getAllCours();
      return;
    }

    // Définit les nouveaux critères de recherche actifs
    this.activeSearchCriteria = criteria;
    // Réinitialise la pagination à la première page pour la nouvelle recherche
    this.pageOptions.page = 0; 
    
    this.loadingIndicator = true;
    this.getAllCours();
  }

  /**
   * Vérifie si les critères de recherche sont vides
   */
  private isEmptySearch(criteria: any): boolean {
    return Object.values(criteria).every(value => 
      value === null || value === undefined || value === ''
    );
  }

  // --- Utilitaires pour l'affichage ---

  /**
   * Retourne le nom d'une filière à partir de son ID
   */
  getFiliereName(idFiliere: number): string {
    const filiere = this.filieres.find(f => f.value === idFiliere);
    return filiere ? filiere.label : 'Non définie';
  }

  /**
   * Retourne le nom d'une matière à partir de son ID
   */
  getMatiereName(idMatiere: number): string {
    const matiere = this.matieres.find(m => m.value === idMatiere);
    return matiere ? matiere.label : 'Non définie';
  }

  /**
   * Obtient la classe CSS pour le semestre (simple exemple)
   */
  getSemestreClass(semestre: string): string {
    const lowerSemestre = semestre?.toLowerCase();
    if (lowerSemestre?.includes('s1') || lowerSemestre?.includes('p1')) return 'text-primary fw-bold';
    if (lowerSemestre?.includes('s2') || lowerSemestre?.includes('p2')) return 'text-info fw-bold';
    return 'text-secondary';
  }
}
