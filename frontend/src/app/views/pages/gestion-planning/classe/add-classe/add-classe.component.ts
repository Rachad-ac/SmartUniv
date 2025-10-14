import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Alertes } from 'src/app/util/alerte';

// Services assumés
import { ClasseService } from 'src/app/services/classe/classe.service';
import { FiliereService } from 'src/app/services/filiere/filiere.service';

@Component({
  selector: 'app-add-classe',
  templateUrl: './add-classe.component.html',
  styleUrls: ['./add-classe.component.scss']
})
export class AddClasseComponent implements OnInit {

  message = '';
  filieres: any[] = [];
  loading = false;

  form!: FormGroup;
  @Output() submit: EventEmitter<boolean> = new EventEmitter();
  @Output() search: EventEmitter<any> = new EventEmitter();
  @Input() classeToUpdate: any; 
  @Input() isSearch: boolean = false;

  // Liste statique des niveaux pour l'ajout/recherche
  niveaux: any [] = [
    { label : 'Licence 1' , value : 'L1'},
    { label : 'Licence 2' , value : 'L2'},
    { label : 'Licence 3' , value : 'L3'},
    { label : 'Master 1' , value : 'M1'},
    { label : 'Master 1' , value : 'M2'},
  ];

  constructor(
    private classeService: ClasseService,
    private filiereService: FiliereService,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadFilieres();
    
    if (this.isSearch) {
      this.initSearchForm();
    } else {
      this.initAddForm();
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
        // Filières par défaut ou gestion d'erreur
      }
    });
  }
  
  /**
   * Initialise le formulaire de recherche de classe
   */
  initSearchForm() {
    this.form = this.fb.group({
      nom: [''], 
      niveau: [''],
      id_filiere: ['']
    });
  }

  /**
   * Initialise le formulaire d'ajout de classe
   */
  initAddForm() {
    this.form = this.fb.group({
      nom: ['', [Validators.required, Validators.maxLength(50)]],
      niveau: ['', Validators.required],
      effectif: [0, [Validators.min(0)]], // Effectif initial à 0 par défaut
      id_filiere: ['', Validators.required]
    });
  }

  /**
   * Crée une nouvelle classe
   */
  create(): void {
    if (this.form.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.loading = true;
    const classeData = this.form.value;

    this.classeService.createClasse(classeData).subscribe({
      next: (response: any) => {
        if (response.success) {
          Alertes.alerteAddSuccess('Classe créée avec succès');
          this.emitSubmit();
          this.close();
        } else {
          Alertes.alerteAddDanger(response.message || 'Erreur lors de la création de la classe');
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors de la création de la classe', err);
        Alertes.alerteAddDanger(err.error?.message || 'Erreur lors de la création de la classe');
        this.loading = false;
      }
    });
  }

  /**
   * Lance la recherche de classes
   */
  doSearch(): void {
    const searchCriteria = this.form.value;
    // Nettoyer les valeurs vides
    Object.keys(searchCriteria).forEach(key => {
      if (!searchCriteria[key] || searchCriteria[key] === '') {
        delete searchCriteria[key];
      }
    });
    
    this.search.emit(searchCriteria);
    this.close(); // Ferme le modal de recherche après l'émission
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
