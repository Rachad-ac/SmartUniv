import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatiereService } from 'src/app/services/matiere/matiere.service';
import { Alertes } from 'src/app/util/alerte';

@Component({
  selector: 'app-list-matiere',
  templateUrl: './list-matiere.component.html',
  styleUrls: ['./list-matiere.component.scss']
})
export class ListMatiereComponent implements OnInit {

  displayedColumns: string[] = [
    'nom',
    'code',
    'description',
    'actions'
  ];

  matiereToUpdate: any;
  dataSource: any;
  loadingIndicator = true;
  searchTerm: string = '';
  pageOptions: any = { page: 0, size: 10 };

  constructor(
    private modalService: NgbModal,
    private matiereService: MatiereService
  ) {}

  ngOnInit(): void {
    this.getAllMatieres();
  }

  /**
   * 🔹 Récupère toutes les matières
   */
  getAllMatieres(): void {
    this.loadingIndicator = true;
    this.matiereService.getMatieres().subscribe({
      next: (response: any) => {
        if (response.success || Array.isArray(response)) {
          const data = response.data || response;
          this.dataSource = {
            payload: data,
            metadata: { totalElements: data?.length || 0 }
          };
        } else {
          this.dataSource = { payload: [], metadata: { totalElements: 0 } };
          Alertes.alerteAddDanger(response.message || 'Erreur lors du chargement des matières');
        }
        this.loadingIndicator = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des matières', err);
        Alertes.alerteAddDanger('Erreur lors du chargement des matières');
        this.loadingIndicator = false;
      }
    });
  }

  /**
   * 🔹 Ouvre le modal d’ajout de matière
   */
  openAddMatiere(content: TemplateRef<any>): void {
    this.openModal(content, 'lg');
  }

  /**
   * 🔹 Ouvre le modal d’édition d’une matière
   */
  openEditMatiere(content: TemplateRef<any>, matiere: any): void {
    this.matiereToUpdate = matiere;
    this.openModal(content, 'lg');
  }

  /**
   * 🔹 Ouvre un modal générique
   */
  openModal(content: TemplateRef<any>, size: 'md' | 'sm' | 'lg' | 'xl'): void {
    this.modalService.open(content, { size, backdrop: 'static' }).result.then(
      () => {},
      () => {}
    );
  }

  /**
   * 🔹 Supprime une matière
   */
  deleteMatiere(matiere: any): void {
    Alertes.confirmAction(
      'Voulez-vous supprimer cette matière ?',
      `La matière ${matiere.nom} sera définitivement supprimée.`,
      () => {
        this.matiereService.deleteMatiere(matiere.id_matiere).subscribe({
          next: (response: any) => {
            if (response.success) {
              Alertes.alerteAddSuccess('Matière supprimée avec succès');
              this.getAllMatieres();
            } else {
              Alertes.alerteAddDanger(response.message || 'Erreur lors de la suppression');
            }
          },
          error: (err) => {
            console.error('Erreur lors de la suppression', err);
            Alertes.alerteAddDanger(err?.error?.message || 'Erreur lors de la suppression');
          }
        });
      }
    );
  }

  /**
   * 🔹 Recherche de matières (nom, code, description)
   */
  doSearch(): void {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      this.getAllMatieres();
      return;
    }

    this.loadingIndicator = true;
    this.matiereService.searchMatieres({ nom: this.searchTerm.trim() }).subscribe({
      next: (response: any) => {
        if (response.success || Array.isArray(response)) {
          const data = response.data || response;
          this.dataSource = {
            payload: data,
            metadata: { totalElements: data?.length || 0 }
          };
          this.modalService.dismissAll();
        } else {
          this.dataSource = { payload: [], metadata: { totalElements: 0 } };
          Alertes.alerteAddDanger(response.message || 'Aucune matière trouvée');
        }
        this.loadingIndicator = false;
      },
      error: (err) => {
        console.error("Erreur lors de la recherche", err);
        Alertes.alerteAddDanger('Erreur lors de la recherche de matières');
        this.loadingIndicator = false;
      }
    });
  }

  /**
   * 🔹 Rafraîchit la liste
   */
  refresh(): void {
    this.getAllMatieres();
  }

  /**
   * 🔹 Ferme les modals
   */
  close(): void {
    this.modalService.dismissAll();
    this.getAllMatieres();
  }

  /**
   * 🔹 Gestion de la pagination
   */
  paginate($event: number): void {
    this.loadingIndicator = true;
    this.pageOptions.page = $event - 1;
    this.getAllMatieres();
  }
}
