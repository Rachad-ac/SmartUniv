import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SalleService } from 'src/app/services/salle/salle.service';
import { ReservationService } from 'src/app/services/reservation/reservation.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Alertes } from 'src/app/util/alerte';

@Component({
  selector: 'app-detail-salle',
  templateUrl: './detail-salle.component.html',
  styleUrls: ['./detail-salle.component.scss']
})
export class DetailSalleComponent implements OnInit {

  types = [
    { value: 'Cours', label: 'Cours' },
    { value: 'Examen', label: 'Examen' },
    { value: 'Evenement', label: 'Événement' },
    { value: 'TP', label: 'Travaux Pratiques' }
  ];

  salle: any;
  reservationForm!: FormGroup;
  disponibiliteForm!: FormGroup;

  disponibilite: boolean | null = null;
  checking = false;
  submitting = false;
  loading = false;
  currentUser : any;

  constructor(
    private route: ActivatedRoute,
    private salleService: SalleService,
    private reservationService: ReservationService,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    const id_salle = this.route.snapshot.paramMap.get('id');
    if (id_salle) this.getSalleDetails(+id_salle);

    const user = localStorage.getItem('user');
    if(user){
      this.currentUser = JSON.parse(user);
    }

    // 🧩 Formulaire de réservation
    this.reservationForm = this.fb.group({
      id_user: [this.currentUser.id, Validators.required],
      id_salle: [id_salle, Validators.required],
      date_debut: ['', Validators.required],
      date_fin: ['', Validators.required],
      type_reservation: ['', Validators.required],
      motif: ['']
    });

    // 🧩 Formulaire de disponibilité séparé
    this.disponibiliteForm = this.fb.group({
      id_salle: [id_salle, Validators.required],
      date_debut: ['', Validators.required],
      date_fin: ['', Validators.required]
    });
  }

  // 🔹 Charger les détails de la salle
  getSalleDetails(id: number) {
    this.loading = true;
    this.salleService.getSalle(id).subscribe({
      next: (res: any) => {
        this.salle = res.data;
        this.reservationForm.patchValue({ id_salle: this.salle.id_salle });
        this.disponibiliteForm.patchValue({ id_salle: this.salle.id_salle });
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur salle :', err);
        this.loading = false;
      }
    });
  }

  // 🔍 Vérifier disponibilité
  checkDisponibilite() {
    if (this.disponibiliteForm.invalid) {
      Alertes.alerteAddDanger('Veuillez remplir les champs de disponibilité.');
      return;
    }

    this.checking = true;
    const { id_salle, date_debut, date_fin } = this.disponibiliteForm.value;

    this.reservationService.checkAvailability({ id_salle, date_debut, date_fin }).subscribe({
      next: (res: any) => {
        this.checking = false;
        this.disponibilite = res.available;
        if (res.available) {
          Alertes.alerteAddSuccess('✅ La salle est disponible.');
        } else {
          Alertes.alerteAddDanger('❌ La salle est déjà réservée pour cette période.');
        }
      },
      error: () => {
        this.checking = false;
        Alertes.alerteAddDanger('Erreur lors de la vérification de la disponibilité.');
      }
    });
  }

  // 📝 Créer une réservation
  reserver() {
    if (this.reservationForm.invalid) {
      Alertes.alerteAddDanger('Veuillez remplir tous les champs du formulaire.');
      return;
    }

    this.submitting = true;
    this.reservationService.createReservation(this.reservationForm.value).subscribe({
      next: () => {
        this.submitting = false;
        Alertes.alerteAddSuccess('✅ Demande de réservation envoyée avec succès !');
        this.modalService.dismissAll();
      },
      error: (err) => {
        this.submitting = false;
        if (err.status === 409) {
          Alertes.alerteAddDanger('⚠️ Conflit de réservation détecté !');
        } else {
          Alertes.alerteAddDanger('Erreur lors de la création de la réservation.');
        }
      }
    });
  }

  // Ouvrir la modale
  openModal(content: TemplateRef<any>, size: 'md' | 'sm' | 'lg' | 'xl' = 'lg') {
    this.modalService.open(content, { size, backdrop: 'static' });
  }

  // Fermer la modale
  close() {
    this.modalService.dismissAll();
  }
}
