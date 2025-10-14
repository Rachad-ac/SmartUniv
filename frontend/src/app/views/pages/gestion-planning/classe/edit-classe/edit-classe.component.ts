import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Alertes } from 'src/app/util/alerte';

// Services assumés
import { ClasseService } from 'src/app/services/classe/classe.service';
import { FiliereService } from 'src/app/services/filiere/filiere.service';

@Component({
  selector: 'app-edit-classe',
  templateUrl: './edit-classe.component.html',
  styleUrls: ['./edit-classe.component.scss']
})
export class EditClasseComponent implements OnInit {

  form!: FormGroup;
  @Output() submit: EventEmitter<boolean> = new EventEmitter();
  @Output() search: EventEmitter<any> = new EventEmitter();
  @Input() classeToUpdate: any;
  @Input() isSearch: boolean = false;

  filieres: any[] = [];
  loading = false;
  
  // Liste statique des niveaux pour l'ajout/recherche
  niveaux: any [] = [
    { label : 'Licence 1' , value : 'L1'},
    { label : 'Licence 2' , value : 'L2'},
    { label : 'Licence 3' , value : 'L3'},
    { label : 'Master 1' , value : 'M1'},
    { label : 'Master 1' , value : 'M2'},
  ];
  
  constructor(
    private modalService: NgbModal,
    private classeService: ClasseService,
    private filiereService: FiliereService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadFilieres();
    this.initForm();
    this.loadFields();
  }

  /**
   * Charge la liste des filières disponibles
   */
  loadFilieres(): void {
    this.filiereService.getFilieres().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.filieres = response.data.map((filiere: any) => ({
            value: filiere.id_filiere,
            label: filiere.nom
          }));
        }
      },
      error: (err) => {
        console.error('Erreur lors du chargement des filières', err);
        // Filières par défaut ou gestion d'erreur
      }
    });
  }

  /**
   * Initialise le formulaire avec les validateurs requis
   */
  initForm(): void {
    this.form = this.fb.group({
      nom: ['', [Validators.required, Validators.maxLength(50)]],
      niveau: ['', Validators.required],
      effectif: [0, [Validators.min(0)]], 
      id_filiere: ['', Validators.required]
    });
  }

  /**
   * Charge les données de la classe à modifier dans le formulaire
   */
  loadFields(): void {
    if (!this.classeToUpdate) { return; }
    
    this.form.patchValue({
      nom: this.classeToUpdate?.nom || '',
      niveau: this.classeToUpdate?.niveau || '',
      effectif: this.classeToUpdate?.effectif || 0,
      // La filière peut être soit l'ID, soit un objet complet dans la source de données
      id_filiere: this.classeToUpdate?.id_filiere || this.classeToUpdate?.filiere?.id_filiere || ''
    });
  }

  /**
   * Met à jour la classe
   */
  update(): void {
    if (this.form.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.loading = true;
    const classeData = this.form.value;

    this.classeService.updateClasse(this.classeToUpdate?.id_classe, classeData).subscribe({
      next: (response: any) => {
        if (response.success) {
          Alertes.alerteAddSuccess('Classe modifiée avec succès');
          this.emitSubmit();
        } else {
          Alertes.alerteAddDanger(response.message || 'Erreur lors de la modification de la classe');
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
      if (field.errors['maxlength']) return `Le nom ne doit pas dépasser ${field.errors['maxlength'].requiredLength} caractères`;
      if (field.errors['min']) return `L'effectif doit être positif`;
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
