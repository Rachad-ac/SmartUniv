import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Alertes } from 'src/app/util/alerte';
import { SalleService } from 'src/app/services/salle/salle.service'; 

@Component({
  selector: 'app-add-salle',
  templateUrl: './add-salle.component.html',
  styleUrls: ['./add-salle.component.scss']
})
export class AddSalleComponent implements OnInit {

  message = '';
  loading = false;

  form!: FormGroup;
  @Output() submit: EventEmitter<boolean> = new EventEmitter();
  @Output() search: EventEmitter<any> = new EventEmitter();
  
  @Input() salleToUpdate: any; 
  @Input() isSearch: boolean = false;

  // CONFORMITÉ MIGRATION : Utilisation des valeurs ENUM comme chaînes
  typesSalles: string[] = ['TP', 'Amphi', 'Cours'];
  etats: any = [
    {value : 'Disponible' , label : 'Disponible'},
    {value : 'Occupée' , label : 'Occupée'},
    {value : 'Maintenance' , label : 'Maintenance'},
  ];

  constructor(
    private salleService: SalleService,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    if (this.isSearch) {
      this.initSearchForm();
    } else {
      this.initForm();
    }
  }
  
  /**
   * Initialise le formulaire de recherche
   */
  initSearchForm() {
    this.form = this.fb.group({
      nom: [''], 
      type_salle: [''], // Nom du champ de la migration
      capacite: [''], 
      localisation: [''],
      etat: [''] // Nom du champ de la migration
    });
  }

  /**
   * Initialise le formulaire d'ajout
   */
  initForm() {
    this.form = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      type_salle: ['', [Validators.required]], // Champ 'type_salle' (enum)
      capacite: ['', [Validators.required, Validators.min(1), Validators.pattern(/^[0-9]+$/)]], 
      localisation: ['', [Validators.required, Validators.minLength(3)]],
      etat: ['Disponible', [Validators.required]], // Champ 'etat' (enum, valeur par défaut 'Disponible')
      photo: [''] // Champ 'photo' (nullable)
    });
  }

  /**
   * Crée une nouvelle salle
   */
  create(): void {
    if (this.form.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.loading = true;
    const salleData = this.form.value;
    salleData.capacite = parseInt(salleData.capacite, 10);
    
    this.salleService.createSalle(salleData).subscribe({
      next: (response: any) => {
        if (response.success) {
          Alertes.alerteAddSuccess('Salle créée avec succès');
          this.emitSubmit();
        } else {
          Alertes.alerteAddDanger(response.message || 'Erreur lors de la création');
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors de la création de la salle', err);
        Alertes.alerteAddDanger(err.error?.message || 'Erreur serveur. Veuillez vérifier les données soumises.');
        this.loading = false;
      },
      complete: () => {
        this.close();
      }
    });
  }

  /**
   * Effectue une recherche de salles
   */
  doSearch(): void {
    if (!this.isSearch) return;

    const searchCriteria = this.form.value;
    
    Object.keys(searchCriteria).forEach(key => {
      if (searchCriteria[key] === null || searchCriteria[key] === undefined || searchCriteria[key] === '') {
        delete searchCriteria[key];
      }
    });
    
    if (searchCriteria.capacite) {
        searchCriteria.capacite = parseInt(searchCriteria.capacite, 10);
    }
    
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
   * Obtient le message d'erreur pour un champ
   */
  getErrorMessage(fieldName: string): string {
    const field = this.form.get(fieldName);
    
    let displayName = fieldName;
    if (fieldName === 'type_salle') displayName = 'Type de salle'; // Ajustement d'affichage
    if (fieldName === 'etat') displayName = 'État'; // Ajustement d'affichage

    if (field?.errors) {
      if (field.errors['required']) return `${displayName} est requis`;
      if (field.errors['minlength']) return `${displayName} doit contenir au moins ${field.errors['minlength'].requiredLength} caractères`;
      if (field.errors['min']) return `${displayName} doit être supérieur ou égal à ${field.errors['min'].min}`;
      if (field.errors['pattern']) return `${displayName} doit être un nombre entier valide`;
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