import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Alertes } from 'src/app/util/alerte';
import { FiliereService } from 'src/app/services/filiere/filiere.service';

@Component({
  selector: 'app-add-filiere',
  templateUrl: './add-filiere.component.html',
  styleUrls: ['./add-filiere.component.scss']
})
export class AddFiliereComponent implements OnInit {

  form!: FormGroup;
  loading = false;
  message = '';

  @Output() submit: EventEmitter<boolean> = new EventEmitter();
  @Output() search: EventEmitter<any> = new EventEmitter();
  @Input() filiereToUpdate: any;
  @Input() isSearch: boolean = false;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private filiereService: FiliereService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  /**
   * Initialise le formulaire d’ajout de filière
   */
  initForm() {
    this.form = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      code: ['', [Validators.required, Validators.minLength(2)]],
      description: ['']
    });
  }


  /**
   * Crée une nouvelle filière
   */
  create(): void {
    if (this.form.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.loading = true;
    const filiereData = this.form.value;

    this.filiereService.createFiliere(filiereData).subscribe({
      next: (response: any) => {
        if (response.success) {
          Alertes.alerteAddSuccess('Filière ajoutée avec succès');
          this.emitSubmit();
        } else {
          Alertes.alerteAddDanger(response.message || 'Erreur lors de la création de la filière');
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors de la création de la filière', err);
        Alertes.alerteAddDanger(err.error?.message || 'Erreur lors de la création');
        this.loading = false;
      },
      complete: () => this.close()
    });
  }

  /**
   * Recherche une ou plusieurs filières
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
