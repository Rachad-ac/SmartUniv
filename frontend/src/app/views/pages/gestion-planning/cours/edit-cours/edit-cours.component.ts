import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Alertes } from 'src/app/util/alerte';
// Services assumés pour la gestion des cours et des données associées
import { CoursService } from 'src/app/services/cours/cours.service';
import { FiliereService } from 'src/app/services/filiere/filiere.service';
import { MatiereService } from 'src/app/services/matiere/matiere.service';

@Component({
  selector: 'app-edit-cours',
  templateUrl: './edit-cours.component.html',
  styleUrls: ['./edit-cours.component.scss']
})
export class EditCoursComponent implements OnInit {

  form!: FormGroup;
  
  // Listes de données de référence
  filieres: any[] = [];
  matieres: any[] = [];
  semestres: string[] = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6']; 

  loading = false;

  @Output() submit: EventEmitter<boolean> = new EventEmitter();
  // isSearch et search ne sont généralement pas nécessaires pour un composant d'édition pur
  @Input() coursToUpdate: any; 

  constructor(
    private modalService: NgbModal,
    private coursService: CoursService,
    private filiereService: FiliereService,
    private matiereService: MatiereService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadReferencedData();
    this.initForm();
  }

  /**
   * Charge les données de référence (Filières et Matières)
   */
  loadReferencedData(): void {
    this.filiereService.getFilieres().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.filieres = response.data.map((filiere: any) => ({
            value: filiere.id,
            label: filiere.nom
          }));
        }
      },
      error: (err) => {
        console.error('Erreur lors du chargement des filières', err);
      }
    });

    this.matiereService.getMatieres().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.matieres = response.data.map((matiere: any) => ({
            value: matiere.id,
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
   * Initialise le formulaire avec les validateurs et charge les données du cours à modifier.
   */
  initForm(): void {
    this.form = this.fb.group({
      nom: [this.coursToUpdate?.nom || '', [Validators.required, Validators.minLength(3)]],
      code: [this.coursToUpdate?.code || '', [Validators.required, Validators.minLength(2)]],
      description: [this.coursToUpdate?.description || ''],
      id_matiere: [this.coursToUpdate?.id_matiere || '', Validators.required],
      id_filiere: [this.coursToUpdate?.id_filiere || '', Validators.required],
      semestre: [this.coursToUpdate?.semestre || '', Validators.required],
      volume_horaire: [this.coursToUpdate?.volume_horaire || null, [Validators.required, Validators.min(1)]],
    });
  }

  /**
   * Met à jour le cours.
   */
  update(): void {
    if (this.form.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.loading = true;
    const coursData = this.form.value;

    this.coursService.updateCours(this.coursToUpdate.id, coursData).subscribe({
      next: (response: any) => {
        if (response.success) {
          Alertes.alerteAddSuccess('Cours modifié avec succès');
          this.emitSubmit();
        } else {
          Alertes.alerteAddDanger(response.message || 'Erreur lors de la modification');
        }
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Erreur lors de la modification', error);
        Alertes.alerteAddDanger(error?.error?.message || 'Erreur lors de la mise à jour du cours');
        this.loading = false;
      },
      complete: () => {
        this.close();
      }
    });
  }

  /**
   * Marque tous les champs comme touchés pour afficher les erreurs
   */
  markFormGroupTouched(): void {
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Vérifie si un champ a des erreurs
   */
  hasError(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  /**
   * Obtient le message d'erreur pour un champ
   */
  getErrorMessage(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return 'Ce champ est requis';
      if (field.errors['minlength']) return `Minimum ${field.errors['minlength'].requiredLength} caractères`;
      if (field.errors['min']) return `Doit être supérieur ou égal à ${field.errors['min'].min}`;
    }
    return '';
  }

  emitSubmit(): void {
    this.submit.emit(true);
  }

  close(): void {
    this.modalService.dismissAll();
  }
}
