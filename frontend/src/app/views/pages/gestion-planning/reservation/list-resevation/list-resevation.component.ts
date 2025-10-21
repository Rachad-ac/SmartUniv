import { Component, OnInit } from '@angular/core';
import { ReservationService } from 'src/app/services/reservation/reservation.service';
import { Alertes } from 'src/app/util/alerte';

@Component({
  selector: 'app-list-resevation',
  templateUrl: './list-resevation.component.html',
  styleUrls: ['./list-resevation.component.scss']
})
export class ListResevationComponent implements OnInit{

  displayedColumns: string[] = [
    'user',
    'salle',
    'date_debut',
    'date_fin',
    'statut',
    'actions'
  ];

  pageOptions: any = { page: 0, size: 10 };
  dataSource: any;
  rows: any[] = [];
  total = 0;
  loadingIndicator = true;
  searchTerm: string = '';
  res: any[] = [];

  constructor(
    private reservationService: ReservationService
  ) {}

  ngOnInit(): void {
   this.loadReservations();
  }

  /**
   * Charge tous les Reservations
   */
  loadReservations(): void {
    this.loadingIndicator = true;
    this.reservationService.getAllReservations().subscribe({
      next: (response: any) => {
        console.log('res : ', response);
        if (response.success) {
          this.dataSource = { 
            payload: response.data || [], 
            metadata: { totalElements: response.data?.length || 0 } 
          };
          console.log('res : ', this.dataSource)
        } else {
          this.dataSource = { payload: [], metadata: { totalElements: 0 } };
          Alertes.alerteAddDanger(response.message || 'Erreur lors du chargement');
        }
        this.loadingIndicator = false;
      },
      error: err => {
        console.error('Erreur lors du chargement des reservations', err);
        Alertes.alerteAddDanger('Erreur lors du chargement des reservations');
        this.loadingIndicator = false;
      }
    });
  }

  refresh(): void {
    this.loadReservations();
  }

  enAttente(): void {
    this.loadingIndicator = true;
    this.reservationService.getReservationEnAttente().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.dataSource = { 
            payload: response.data || [], 
            metadata: { totalElements: response.data?.length || 0 } 
          };
          console.log('reserv : ', response.data)
        } else {
          this.dataSource = { payload: [], metadata: { totalElements: 0 } };
          Alertes.alerteAddDanger(response.message || 'Erreur lors du chargement');
        }
        this.loadingIndicator = false;
      },
      error: err => {
        console.error('Erreur lors du chargement des reservations en attente', err);
        Alertes.alerteAddDanger('Erreur lors du chargement des reservations en attente');
        this.loadingIndicator = false;
      }
    });
  }

   /*
  *valider une reservation
  */
  valider(reservation : any): void {
    Alertes.confirmAction(
      'Voulez-vous valider cette resevations ?',
      `L'utilisateur ${reservation.user.nom} ${reservation.user.prenom} sera notifier !`,
      () => {
        this.reservationService.validateReservation(reservation.id_reservation).subscribe({
          next: (response: any) => {
            if (response.success) {
              Alertes.alerteAddSuccess('Reservation valider avec succès');
              this.enAttente();
            } else {
              Alertes.alerteAddDanger(response.message || 'Erreur lors de la validation');
            }
          },
          error: (err) => {
            Alertes.alerteAddDanger(err?.error?.message || 'Erreur lors de la validation');
          }
        });
      }
    );
  }

  /*
  *rejeter une reservation
  */
  rejeter(reservation : any): void {
    Alertes.confirmAction(
      'Voulez-vous rejeter cette resevations ?',
      `L'utilisateur ${reservation.user.nom} ${reservation.user.prenom} sera notifier !`,
      () => {
        this.reservationService.rejectReservation(reservation.id_reservation).subscribe({
          next: (response: any) => {
            if (response.success) {
              Alertes.alerteAddSuccess('Reservation rejeter avec succès');
              this.enAttente();
            } else {
              Alertes.alerteAddDanger(response.message || 'Erreur lors de la refutation');
            }
          },
          error: (err) => {
            Alertes.alerteAddDanger(err?.error?.message || 'Erreur lors de la refutation');
          }
        });
      }
    );
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
   * Effectue une recherche d'utilisateurs
   */
  doSearch(criteria: any): void {
    if (Object.keys(criteria).length === 0 || this.isEmptySearch(criteria)) {
      this.loadReservations();
      return;
    }

    this.loadingIndicator = true;
    this.reservationService.searchReservations(criteria).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.dataSource = { 
            payload: response.data || [], 
            metadata: { totalElements: response.data?.length || 0 } 
          };
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
   * Gestion de la pagination
   */
  paginate($event: number): void {
    this.loadingIndicator = true;
    this.pageOptions.page = $event - 1;
    this.loadReservations();
  }


}
