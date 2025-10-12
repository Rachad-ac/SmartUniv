import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PlanningService } from 'src/app/services/planning/planning.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Alertes } from 'src/app/util/alerte';
import { Helper } from 'src/app/util/helper';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-edit-planning',
  templateUrl: './edit-planning.component.html',
  styleUrls: ['./edit-planning.component.scss']
})
export class EditPlanningComponent implements OnInit {
  form!: FormGroup;
  @Output() submit: EventEmitter<boolean> = new EventEmitter();
  @Input() planningToUpdate: any;
  classes: any[] = [];
  cours: any[] = [];
  salles: any[] = [];
  users: any[] = [];
  loading = false;
  optionsLoaded = false; // Nouvelle variable pour suivre le chargement

  constructor(
    private planningService: PlanningService, 
    private userService : UserService,
    private modalService: NgbModal) {}

  async ngOnInit() {
    console.log('📥 Données reçues dans EditPlanning:', this.planningToUpdate);
    this.initForm();
    await this.loadOptions(); // Attendre le chargement des options
    this.loadFields();
  }

  async loadOptions(): Promise<void> {
    try {
      // Charger toutes les options en parallèle
      const [classesRes, coursRes, sallesRes] = await Promise.all([
        this.planningService.getClasses().toPromise(),
        this.planningService.getCours().toPromise(),
        this.planningService.getSalles().toPromise()
      ]);

      this.classes = classesRes?.data || classesRes || [];
      this.cours = coursRes?.data || coursRes || [];
      this.salles = sallesRes?.data || sallesRes || [];

      // Charger les utilisateurs
      await this.loadUsers();

      console.log('📊 Options chargées:');
      console.log('- Classes:', this.classes.length);
      console.log('- Cours:', this.cours.length);
      console.log('- Salles:', this.salles.length);
      console.log('- Users:', this.users.length);
      
      this.optionsLoaded = true;

    } catch (error) {
      console.error('❌ Erreur chargement options:', error);
    }
  }

  loadUsers(): Promise<void> {
    return new Promise((resolve) => {
      this.userService.getUsers().subscribe({
        next: (res) => {
          console.log('Recruteur récupérés :', res.data);
          this.users = res.data.map((user: any) => ({
            ...user,
            fullName: `${user.prenom} ${user.nom}`,
            id_user: user.id,
          })).filter((user: any) => user.role === 'Enseignant');
          resolve();
        },
        error: (err) => {
          console.error('Erreur chargement users:', err);
          resolve();
        }
      });
    });
  }

  initForm(): void {
    this.form = new FormGroup({
      id_classe: new FormControl('', Validators.required),
      id_cours: new FormControl('', Validators.required),
      id_salle: new FormControl('', Validators.required),
      id_user: new FormControl('', Validators.required),
      date_debut: new FormControl('', Validators.required),
      date_fin: new FormControl('', Validators.required),
      description: new FormControl(''),
    });
  }

  loadFields() {
    if (this.planningToUpdate !== undefined && this.optionsLoaded) {
      console.log('🔄 Remplissage du formulaire avec:', this.planningToUpdate);
      
      const extendedProps = this.planningToUpdate.extendedProps || {};
      
      // Debug des données disponibles
      console.log('🔍 Données extendedProps:', extendedProps);
      console.log('🏫 Salles disponibles:', this.salles);
      console.log('🎯 ID salle à utiliser:', extendedProps.id_salle || extendedProps.salle_id);

      this.form.patchValue({
        id_classe: extendedProps.id_classe || this.planningToUpdate.id_classe,
        id_cours: extendedProps.cours_id || extendedProps.id_cours || this.planningToUpdate.id_cours,
        id_salle: extendedProps.id_salle || extendedProps.salle_id || this.planningToUpdate.id_salle,
        id_user: extendedProps.id_user || extendedProps.user_id || this.planningToUpdate.id_user,
        date_debut: this.formatDateForInput(this.planningToUpdate.start),
        date_fin: this.formatDateForInput(this.planningToUpdate.end),
        description: extendedProps.description || this.planningToUpdate.description
      });

      // Vérifier après un court délai que les valeurs sont bien sélectionnées
      setTimeout(() => {
        console.log('✅ Formulaire rempli:', this.form.value);
        console.log('🎯 Salle sélectionnée:', this.form.get('id_salle')?.value);
        console.log('📋 Salle correspondante:', this.salles.find(s => s.id_salle == this.form.get('id_salle')?.value));
      }, 100);
    } else {
      console.log('⏳ Options pas encore chargées, report du remplissage...');
    }
  }

  // Méthode pour formater les dates pour l'input datetime-local
  private formatDateForInput(date: Date | string): string {
    if (!date) return '';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Format: YYYY-MM-DDTHH:mm (pour datetime-local)
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  update(): void {
    if (this.form.invalid) {
      console.warn('Formulaire invalide:', this.form.errors);
      this.markFormGroupTouched();
      return;
    }
    
    this.loading = true;
    const payload = this.form.value;
    
    // Utiliser l'ID correct
    const id = this.planningToUpdate?.id || this.planningToUpdate?.extendedProps?.id_planning;
    
    console.log('📤 Mise à jour du planning:', { id, payload });
    
    this.planningService.updatePlanning(id, payload).subscribe({
      next: () => {
        Alertes.alerteAddSuccess('Modification réussie');
        this.submit.emit(true);
        this.close();
      },
      error: (err: any) => {
        console.error('❌ Erreur mise à jour:', err);
        if (err.status === 409 && err.error?.error) {
          Alertes.alerteAddDanger(err.error.error);
        } else {
          Alertes.alerteAddDanger(err?.error?.message || 'Erreur lors de la mise à jour');
        }
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.form.controls).forEach(key => {
      this.form.get(key)?.markAsTouched();
    });
  }

  close(): void {
    this.modalService.dismissAll();
  }
}