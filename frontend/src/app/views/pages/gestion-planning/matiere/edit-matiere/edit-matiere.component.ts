import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Alertes } from 'src/app/util/alerte';
import { MatiereService } from 'src/app/services/matiere/matiere.service';

@Component({
  selector: 'app-edit-matiere',
  templateUrl: './edit-matiere.component.html',
  styleUrls: ['./edit-matiere.component.scss']
})
export class EditMatiereComponent implements OnInit {

  form!: FormGroup;
  @Output() submit: EventEmitter<boolean> = new EventEmitter();
  @Input() matiereToUpdate: any;

  loading = false;

  enseignants: any[] = []; // À remplir si besoin

  constructor(
    private modalService: NgbModal,
    private matiereService: MatiereService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadFields();
  }

  /**
   * Initialise le formulaire
   */
  initForm(): void {
    this.form = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      code: ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
    });
  }

  /**
   * Charge les données de la matière à modifier
   */
  loadFields(): void {
    if (!this.matiereToUpdate) return;

    this.form.patchValue({
      nom: this.matiereToUpdate?.nom || '',
      code: this.matiereToUpdate?.code || '',
      description: this.matiereToUpdate?.description || '',
    });
  }

  /**
   * Met à jour la matière
   */
  update(): void {
    if (this.form.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.loading = true;
    const matiereData = this.form.value;

    this.matiereService.updateMatiere(this.matiereToUpdate?.id_matiere, matiereData)
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            Alertes.alerteAddSuccess('Matière modifiée avec succès');
            this.emitSubmit();
          } else {
            Alertes.alerteAddDanger(response.message || 'Erreur lors de la modification');
          }
          this.loading = false;
        },
        error: (error: any) => {
          console.error('Erreur lors de la modification', error);
          Alertes.alerteAddDanger(error?.error?.message || 'Erreur lors de la mise à jour');
          this.loading = false;
        },
        complete: () => this.close()
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
   * Retourne le message d'erreur pour un champ
   */
  getErrorMessage(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return `${fieldName} est requis`;
      if (field.errors['minlength'])
        return `${fieldName} doit contenir au moins ${field.errors['minlength'].requiredLength} caractères`;
      if (field.errors['min'])
        return `${fieldName} doit être supérieur à 0`;
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
