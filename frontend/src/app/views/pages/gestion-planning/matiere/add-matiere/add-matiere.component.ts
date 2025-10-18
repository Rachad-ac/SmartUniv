import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Alertes } from 'src/app/util/alerte';
import { MatiereService } from 'src/app/services/matiere/matiere.service';

@Component({
  selector: 'app-add-matiere',
  templateUrl: './add-matiere.component.html',
  styleUrls: ['./add-matiere.component.scss']
})
export class AddMatiereComponent implements OnInit {

  form!: FormGroup;
  loading = false;
  enseignants: any[] = [];

  @Output() submit: EventEmitter<boolean> = new EventEmitter();
  @Output() search: EventEmitter<any> = new EventEmitter();
  @Input() matiereToUpdate: any;
  @Input() isSearch: boolean = false;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private matiereService: MatiereService,
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  /**
   * Initialise le formulaire d’ajout ou de recherche de matière
   */
  initForm() {
    this.form = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      code: ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
    });
  }

  /**
   * Crée une nouvelle matière
   */
  create(): void {
    if (this.form.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.loading = true;
    const matiereData = this.form.value;

    this.matiereService.createMatiere(matiereData).subscribe({
      next: (response: any) => {
        if (response.success) {
          Alertes.alerteAddSuccess('Matière ajoutée avec succès');
          this.emitSubmit();
        } else {
          Alertes.alerteAddDanger(response.message || 'Erreur lors de la création de la matière');
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors de la création de la matière', err);
        Alertes.alerteAddDanger(err.error?.message || 'Erreur lors de la création');
        this.loading = false;
      },
      complete: () => this.close()
    });
  }

  /**
   * Recherche une ou plusieurs matières
   */
  doSearch(): void {
    const searchCriteria = this.form.value;
    Object.keys(searchCriteria).forEach(key => {
      if (!searchCriteria[key]) delete searchCriteria[key];
    });
    this.search.emit(searchCriteria);
  }

  /**
   * Vérifie si un champ a des erreurs
   */
  hasError(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  /**
   * Retourne le message d’erreur d’un champ
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

  /**
   * Marque tous les champs comme touchés pour afficher les erreurs
   */
  markFormGroupTouched(): void {
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      control?.markAsTouched();
    });
  }

  emitSubmit(): void {
    this.submit.emit(true);
  }

  close(): void {
    this.modalService.dismissAll();
  }
}
