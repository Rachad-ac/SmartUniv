import { Component, OnInit } from '@angular/core';
import { HistoriqueReservationService } from 'src/app/services/historique-reservation/historique-reservation.service';
import { Alertes } from 'src/app/util/alerte';

@Component({
  selector: 'app-historique-reservation',
  templateUrl: './historique-reservation.component.html',
  styleUrls: ['./historique-reservation.component.scss']
})
export class HistoriqueReservationComponent implements OnInit {

  // Colonnes à afficher pour l'historique
  displayedColumns: string[] = [
    'action',       
    'utilisateur',  
    'reservation',        
    'date_action',
    'details',
    'actions'       // <-- AJOUT DE LA COLONNE D'ACTIONS
  ];

  pageOptions: any = { page: 0, size: 10 };
  dataSource: any; // Structure pour les données de la table
  total = 0;
  loadingIndicator = true;
  searchTerm: string = ''; // Champ pour la recherche simple ou complexe
  
  constructor(
    private historiqueService: HistoriqueReservationService 
  ) {}

  ngOnInit(): void {
    this.loadHistoriques();
  }

  /**
   * Charge tous les enregistrements d'historique de réservation.
   */
  loadHistoriques(): void {
    this.loadingIndicator = true;
    
    // Utilisez une méthode du service pour récupérer tous les historiques (similaire à getAllReservations)
    this.historiqueService.getHistoriqueReservations().subscribe({
      next: (response: any) => {
        console.log('historiques chargés : ', response.data);
        if (response.success) {
          this.dataSource = { 
            payload: response.data || [], 
            metadata: { totalElements: response.data?.length || 0 } 
          };
        } else {
          this.dataSource = { payload: [], metadata: { totalElements: 0 } };
          Alertes.alerteAddDanger(response.message || 'Erreur lors du chargement de l\'historique');
        }
        this.loadingIndicator = false;
      },
      error: (err : any) => {
        console.error('Erreur lors du chargement de l\'historique', err);
        Alertes.alerteAddDanger('Erreur lors du chargement de l\'historique des réservations');
        this.loadingIndicator = false;
      }
    });
  }

  // NOUVELLE MÉTHODE : Supprimer un enregistrement d'historique
  supprimerHistorique(historique: any): void {
    Alertes.confirmAction(
      'Voulez-vous supprimer cet historique ?',
      `L'action de type "${historique.action}" sera définitivement effacée.`,
      () => {
        // Appelez le service pour supprimer
        // Vous devez créer cette méthode deleteHistorique(id) dans HistoriqueService
        this.historiqueService.deleteHistoriqueReservations(historique.id).subscribe({
          next: (response: any) => {
            if (response.success) {
              Alertes.alerteAddSuccess('Historique supprimé avec succès');
              this.loadHistoriques(); // Recharge la liste après la suppression
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
   * Actualise l'historique.
   */
  refresh(): void {
    this.loadHistoriques();
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
   * Gestion de la pagination
   */
  paginate($event: number): void {
    this.loadingIndicator = true;
    this.pageOptions.page = $event - 1;
    this.loadHistoriques(); // Recharge les données pour la nouvelle page
  }
}