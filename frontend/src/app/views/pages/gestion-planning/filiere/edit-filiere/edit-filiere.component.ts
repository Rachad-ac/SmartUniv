import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Alertes } from 'src/app/util/alerte';
import { FiliereService } from 'src/app/services/filiere/filiere.service';

@Component({
  selector: 'app-edit-filiere',
  templateUrl: './edit-filiere.component.html',
  styleUrls: ['./edit-filiere.component.scss']
})
export class EditFiliereComponent implements OnInit {

  form!: FormGroup;
  @Output() submit: EventEmitter<boolean> = new EventEmitter();
  @Output() search: EventEmitter<any> = new EventEmitter();
  @Input() filiereToUpdate: any;
  @Input() isSearch: boolean = false;

  loading = false;
  id_filiere : any;

  constructor(
    private modalService: NgbModal,
    private filiereService: FiliereService,
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
      description: ['']
    });
  }

  /**
   * Charge les données de la filière à modifier
   */
  loadFields(): void {
    if (!this.filiereToUpdate) return;

    this.form.patchValue({
      nom: this.filiereToUpdate?.nom || '',
      code: this.filiereToUpdate?.code || '',
      description: this.filiereToUpdate?.description || ''
    });
  }

  /**
   * Met à jour la filière
   */
  update(): void {
    if (this.form.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.loading = true;
    const filiereData = this.form.value;

    this.filiereService.updateFiliere(this.filiereToUpdate?.id, filiereData).subscribe({
      next: (response: any) => {
        if (response.success) {
          Alertes.alerteAddSuccess('Filière modifiée avec succès');
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
      complete: () => {
        this.close();
      }
    });
  }

  /**
   * Recherche des filières
   */
  doSearch(): void {
    const searchCriteria = this.form.value;
    Object.keys(searchCriteria).forEach(key => {
      if (!searchCriteria[key] || searchCriteria[key] === '') {
        delete searchCriteria[key];
      }
    });
    this.search.emit(searchCriteria);
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
