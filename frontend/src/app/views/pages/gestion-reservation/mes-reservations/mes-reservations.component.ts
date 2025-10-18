import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReservationService } from 'src/app/services/reservation/reservation.service';
import { Alertes } from 'src/app/util/alerte';

@Component({
  selector: 'app-mes-reservations',
  templateUrl: './mes-reservations.component.html',
  styleUrls: ['./mes-reservations.component.scss']
})
export class MesReservationsComponent implements OnInit {

  types = [
    { value: 'Cours', label: 'Cours' },
    { value: 'Examen', label: 'Examen' },
    { value: 'Evenement', label: 'Événement' },
    { value: 'TP', label: 'Travaux Pratiques' }
  ];

  reservationForm: FormGroup;
  dataSource: any[] = [];
  loadingIndicator = true;
  currentUser: any;
  resToUpdate: any;

  constructor(
    private reservationService: ReservationService,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {
    this.reservationForm = this.fb.group({
      date_debut: ['', Validators.required],
      date_fin: ['', Validators.required],
      type_reservation: ['', Validators.required],
      motif: ['']
    });
  }

  ngOnInit(): void {
    this.loadMesReservations();
  }

  loadMesReservations(): void {
    const user = localStorage.getItem('user');
    if (user) this.currentUser = JSON.parse(user);

    this.loadingIndicator = true;

    this.reservationService.getUserReservations(this.currentUser.id).subscribe({
      next: (res: any) => {
        if (res.success) this.dataSource = res.data || [];
        else {
          this.dataSource = [];
          Alertes.alerteAddDanger(res.message || 'Erreur lors du chargement des réservations');
        }
        this.loadingIndicator = false;
      },
      error: err => {
        Alertes.alerteAddDanger('Erreur lors du chargement des réservations');
        this.loadingIndicator = false;
      }
    });
  }

  openEditRes(content: TemplateRef<any>, reservation: any) {
    this.resToUpdate = reservation;
    this.reservationForm.patchValue({
      date_debut: reservation.date_debut,
      date_fin: reservation.date_fin,
      type_reservation: reservation.type_reservation,
      motif: reservation.motif,
    });
    this.modalService.open(content, { size: 'md', backdrop: 'static' });
  }

  updatedReservation() {
    if (this.reservationForm.invalid) {
      Alertes.alerteAddDanger('Veuillez remplir correctement les champs.');
      return;
    }

    const updatedReservation = { ...this.resToUpdate, ...this.reservationForm.value };

    this.reservationService.updateReservation(this.resToUpdate.id_reservation, updatedReservation)
      .subscribe({
        next: () => {
          Alertes.alerteAddSuccess('Réservation mise à jour avec succès');
          this.modalService.dismissAll();
          this.loadMesReservations();
        },
        error: err => {
          Alertes.alerteAddDanger(err?.error?.message || 'Erreur lors de la mise à jour');
        }
      });
  }

  annulerReservation(reservation: any) {
    Alertes.confirmAction(
      'Voulez-vous annuler cette réservation ?',
      `Vous allez annuler la réservation de la salle ${reservation.salle.nom}.`,
      () => {
        this.reservationService.annulerReservation(reservation.id_reservation).subscribe({
          next: (res: any) => {
            if (res.success) {
              Alertes.alerteAddSuccess('Réservation annulée avec succès');
              this.loadMesReservations();
            } else Alertes.alerteAddDanger(res.message || 'Erreur lors de l’annulation');
          },
          error: err => {
            Alertes.alerteAddDanger(err?.error?.message || 'Erreur lors de l’annulation');
          }
        });
      }
    );
  }
}
