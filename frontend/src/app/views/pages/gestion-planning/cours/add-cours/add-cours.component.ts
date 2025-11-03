import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Alertes } from 'src/app/util/alerte';
// Services assumés pour la gestion des cours et des données associées
import { CoursService } from 'src/app/services/cours/cours.service';
import { FiliereService } from 'src/app/services/filiere/filiere.service';
import { MatiereService } from 'src/app/services/matiere/matiere.service';

@Component({
  selector: 'app-add-cours',
  templateUrl: './add-cours.component.html',
  styleUrls: ['./add-cours.component.scss']
})
export class AddCoursComponent implements OnInit {

  loading = false;
  form!: FormGroup;
  
  // Listes de données de référence
  filieres: any[] = [];
  matieres: any[] = [];
  semestres: any[] = [
    { label : 'Semetre 1' , value : 'S1' },
    { label : 'Semetre 2' , value : 'S2' },
    { label : 'Semetre 3' , value : 'S3' },
    { label : 'Semetre 4' , value : 'S4' },
    { label : 'Semetre 5' , value : 'S5' },
    { label : 'Semetre 6' , value : 'S6' },
    { label : 'Semetre 7' , value : 'S7' },
    { label : 'Semetre 8' , value : 'S8' },
  ];

  @Output() submit: EventEmitter<boolean> = new EventEmitter();
  @Output() search: EventEmitter<any> = new EventEmitter();
  
  @Input() coursToUpdate: any; // Utilisé pour l'édition
  @Input() isSearch: boolean = false; // Utilisé pour le mode recherche

  constructor(
    private coursService: CoursService,
    private filiereService: FiliereService,
    private matiereService: MatiereService,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadFilieres();
    this.loadMatieres();
    
    if (this.isSearch) {
      this.initSearchForm();
    } else {
      this.initForm();
    }
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
      }
    });
  }

  /**
   * Charge la liste des matières disponibles
   */
  loadMatieres(): void {
    this.matiereService.getMatieres().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.matieres = response.data.map((matiere: any) => ({
            value: matiere.id_matiere,
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
   * Initialise le formulaire de recherche (tous les champs sont optionnels)
   */
  initSearchForm() {
    this.form = this.fb.group({
      nom: [''], 		
      code: [''],
      id_filiere: [''],
      id_matiere: [''],
      semestre: [''],
    });
  }

  /**
   * Initialise le formulaire d'ajout/modification
   */
  initForm() {
    this.form = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(3)]],
      code: ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
      id_matiere: ['', Validators.required],
      id_filiere: ['', Validators.required],
      semestre: ['', Validators.required],
      volume_horaire: [null, [Validators.required, Validators.min(1)]],
    });

    if (this.coursToUpdate) {
      // Pour l'édition, on pré-remplit les champs et retire le validateur de volume_horaire si null
      this.form.patchValue({
        nom: this.coursToUpdate.nom,
        code: this.coursToUpdate.code,
        description: this.coursToUpdate.description,
        id_matiere: this.coursToUpdate.id_matiere,
        id_filiere: this.coursToUpdate.id_filiere,
        semestre: this.coursToUpdate.semestre,
        volume_horaire: this.coursToUpdate.volume_horaire
      });
      // Retirer le mot de passe si on ne le change pas (logique non applicable ici, mais bonne pratique)
    }
  }

  /**
   * Soumet le formulaire (création ou mise à jour)
   */
  submitForm(): void {
    if (this.isSearch) {
      this.doSearch();
      return;
    }

    if (this.form.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.loading = true;
    const coursData = this.form.value;
    
    // Déterminer si c'est une création ou une mise à jour
    const observable = this.coursToUpdate 
      ? this.coursService.updateCours(this.coursToUpdate.id_cours, coursData)
      : this.coursService.createCours(coursData);

    observable.subscribe({
      next: (response: any) => {
        if (response.success) {
          Alertes.alerteAddSuccess(`Cours ${this.coursToUpdate ? 'mis à jour' : 'créé'} avec succès`);
          this.emitSubmit();
        } else {
          Alertes.alerteAddDanger(response.message || `Erreur lors de la ${this.coursToUpdate ? 'mise à jour' : 'création'}`);
        }
        this.loading = false;
      },
      error: (err) => {
        console.error(`Erreur lors de la ${this.coursToUpdate ? 'mise à jour' : 'création'}`, err);
        Alertes.alerteAddDanger(err.error?.message || 'Erreur de communication avec le serveur');
        this.loading = false;
      },
      complete: () => {
        this.close();
      }
    });
  }

  /**
   * Effectue une recherche
   */
  doSearch(): void {
    const searchCriteria = this.form.value;
    // Nettoyer les valeurs vides
    Object.keys(searchCriteria).forEach(key => {
      if (!searchCriteria[key] && searchCriteria[key] !== 0) {
        delete searchCriteria[key];
      }
    });
    
    this.search.emit(searchCriteria);
    this.close(); // Fermer le modal de recherche après l'émission
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
      if (field.errors['min']) return `Doit être supérieur à ${field.errors['min'].min}`;
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
