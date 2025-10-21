import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SalleService } from 'src/app/services/salle/salle.service';
import { ReservationService } from 'src/app/services/reservation/reservation.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Alertes } from 'src/app/util/alerte';
import { CoursService } from 'src/app/services/cours/cours.service';
import { FiliereService } from 'src/app/services/filiere/filiere.service';
import { ClasseService } from 'src/app/services/classe/classe.service';

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

  cours : any;
  classes : any;
  filieres : any;
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
    private coursService : CoursService,
    private filiereService : FiliereService,
    private classeService : ClasseService,
    private reservationService: ReservationService,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    const id_salle = this.route.snapshot.paramMap.get('id');
    if (id_salle) this.getSalleDetails(+id_salle);
    this.loadClasses();
    this.loadCours();
    this.loadFilieres();

    const user = localStorage.getItem('user');
    if(user){
      this.currentUser = JSON.parse(user);
    }

    // 🧩 Formulaire de réservation
    this.reservationForm = this.fb.group({
      id_user: [this.currentUser.id, Validators.required],
      id_salle: [id_salle, Validators.required],
      id_cours: [null],
      id_classe: [null],
      id_filiere: [null],
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
  getSalleDetails(id : any) {
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

  /** Charger toutes les filières */
  loadFilieres(): any {
    this.loading = true;
    this.filiereService.getFilieres().subscribe({
      next: (res: any) => {
        console.log(' filiere : ', res.data);
        if (res.success) {
          this.filieres = res.data.map((f: any) => ({
            ...f,
            value: f.id_filiere,
            label: f.nom
          }));
        }
      },
      error: (err) => {
        console.error('Erreur chargement des filieres :', err);
        this.loading = false;
      }
    });
  }

  /** Charger toutes les classes */
  loadClasses(): any {
    this.loading = true;
    this.classeService.getClasses().subscribe({
      next: (res: any) => {
        console.log(' classe : ', res.data);
        if (res.success) {
          this.classes = res.data.map((c: any) => ({
            ...c,
            value: c.id_classe,
            label: c.nom,
            id_filiere: c.id_filiere
          }));
        }
      },
      error: (err) => {
        console.error('Erreur chargement des classes :', err);
        this.loading = false;
      }
    });
  }

  loadCours() : any {
    this.coursService.getCours().subscribe({
      next: (res: any) => {
        console.log(' cours : ', res.data);
        if (res.success) {
          this.cours = res.data.map((c : any) => ({
            ...c,
            value: c.id_cours,
            label: c.nom
          }));
        }
      },
      error: (err) => {
        console.error('Erreur chargement des cours :', err);
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
          Alertes.alerteAddSuccess('La salle est disponible.');
        } else {
          Alertes.alerteAddDanger('La salle est déjà réservée pour cette période.');
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
