import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FiliereService } from 'src/app/services/filiere/filiere.service';
import { Alertes } from 'src/app/util/alerte';

@Component({
  selector: 'app-list-filiere',
  templateUrl: './list-filiere.component.html',
  styleUrls: ['./list-filiere.component.scss']
})
export class ListFiliereComponent implements OnInit {

  displayedColumns: string[] = [
    'nom',
    'code',
    'description',
    'classe',
    'actions'
  ];

  filiereToUpdate: any;
  dataSource: any;
  loadingIndicator = true;
  searchTerm: string = '';
  pageOptions: any = { page: 0, size: 10 };

  constructor(
    private modalService: NgbModal,
    private router : Router,
    private filiereService: FiliereService
  ) {}

  ngOnInit(): void {
    this.getAllFilieres();
  }

  /**
   * Récupère toutes les filières
   */
  getAllFilieres(): void {
    this.loadingIndicator = true;
    this.filiereService.getFilieres().subscribe({
      next: (response: any) => {
        console.log('etudiants : ', response.data)
        if (response.success || Array.isArray(response)) {
          const data = response.data || response;
          this.dataSource = {
            payload: data,
            metadata: { totalElements: data?.length || 0 }
          };
        } else {
          this.dataSource = { payload: [], metadata: { totalElements: 0 } };
          Alertes.alerteAddDanger(response.message || 'Erreur lors du chargement des filières');
        }
        this.loadingIndicator = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des filières', err);
        Alertes.alerteAddDanger('Erreur lors du chargement des filières');
        this.loadingIndicator = false;
      }
    });
  }

  /**
   * Ouvre le modal d’ajout de filière
   */
  openAddFiliere(content: TemplateRef<any>): void {
    this.openModal(content, 'lg');
  }

  /**
   * Ouvre le modal d’édition d’une filière
   */
  openEditFiliere(content: TemplateRef<any>, filiere: any): void {
    this.filiereToUpdate = filiere;
    this.openModal(content, 'lg');
  }

  /**
   * Ouvre un modal générique
   */
  openModal(content: TemplateRef<any>, size: 'md' | 'sm' | 'lg' | 'xl'): void {
    this.modalService.open(content, { size, backdrop: 'static' }).result.then(
      () => {},
      () => {}
    );
  }

  detailFiliere(id: number) {

    if (!id) {

      console.error('⚠️ ID non défini');
      return;
    }

    this.router.navigate(['admin/gestion-planning/filieres/classes', id]);
  }

  /**
   * Supprime une filière
   */
  deleteFiliere(filiere: any): void {
    Alertes.confirmAction(
      'Voulez-vous supprimer cette filière ?',
      `La filière ${filiere.nom} sera définitivement supprimée.`,
      () => {
        this.filiereService.deleteFiliere(filiere.id_filiere).subscribe({
          next: (response: any) => {
            if (response.success) {
              Alertes.alerteAddSuccess('Filière supprimée avec succès');
              this.getAllFilieres();
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
   * Effectue une recherche de filières
   */
  doSearch(): void {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      this.getAllFilieres();
      return;
    }

    this.loadingIndicator = true;
    this.filiereService.searchFilieres(this.searchTerm.trim()).subscribe({
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
          Alertes.alerteAddDanger(response.message || 'Aucune filière trouvée');
        }
        this.loadingIndicator = false;
      },
      error: (err) => {
        console.error("Erreur lors de la recherche", err);
        Alertes.alerteAddDanger('Erreur lors de la recherche de filières');
        this.loadingIndicator = false;
      }
    });
  }

  /**
   * Rafraîchit la liste des filières
   */
  refresh(): void {
    this.getAllFilieres();
  }

  /**
   * Ferme les modals
   */
  close(): void {
    this.modalService.dismissAll();
    this.getAllFilieres();
  }

  /**
   * Gestion de la pagination
   */
  paginate($event: number): void {
    this.loadingIndicator = true;
    this.pageOptions.page = $event - 1;
    this.getAllFilieres();
  }
}
