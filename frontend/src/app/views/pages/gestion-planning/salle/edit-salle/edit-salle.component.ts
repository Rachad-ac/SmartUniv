import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Alertes } from 'src/app/util/alerte';
// Assurez-vous d'avoir créé ce service et d'ajuster le chemin
import { SalleService } from 'src/app/services/salle/salle.service'; 

@Component({
  selector: 'app-edit-salle',
  templateUrl: './edit-salle.component.html',
  styleUrls: ['./edit-salle.component.scss']
})
export class EditSalleComponent implements OnInit {

  form!: FormGroup;
  @Output() submit: EventEmitter<boolean> = new EventEmitter();
  // La recherche n'est généralement pas utilisée dans la modal d'édition, mais gardée par cohérence
  @Output() search: EventEmitter<any> = new EventEmitter(); 
  @Input() salleToUpdate: any; // La salle à modifier, passée depuis le composant parent
  
  // isSearch n'est pas utilisé pour l'édition, mais il est gardé pour éviter des problèmes potentiels
  @Input() isSearch: boolean = false; 

  loading = false;
  
  // Listes d'options prédéfinies basées sur le modèle Salle
  typesSalles: string[] = ['Amphi', 'Laboratoire', 'Salle de cours', 'Salle de réunion'];
  etats: string[] = ['Disponible', 'Occupée', 'Maintenance'];

  constructor(
    private modalService: NgbModal,
    private salleService: SalleService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadFields();
  }

  /**
   * Initialise le formulaire de modification.
   * La validation est similaire à l'ajout, sauf pour 'photo' qui reste optionnel.
   */
  initForm(): void {
    this.form = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      type_salle: ['', [Validators.required]],
      // Capacité: requis, nombre entier positif
      capacite: ['', [Validators.required, Validators.min(1), Validators.pattern(/^[0-9]+$/)]], 
      localisation: ['', [Validators.required, Validators.minLength(3)]],
      etat: ['', [Validators.required]],
      photo: [''] // Optionnel
    });
  }

  /**
   * Charge les données de la salle à modifier dans le formulaire.
   */
  loadFields(): void {
    if (!this.salleToUpdate) { 
        console.error("Aucune salle n'a été fournie pour l'édition.");
        return; 
    }
    
    // Utilise patchValue pour remplir le formulaire
    this.form.patchValue({
      nom: this.salleToUpdate?.nom || '',
      type_salle: this.salleToUpdate?.type_salle || '',
      capacite: this.salleToUpdate?.capacite, // Doit être un nombre, le template le gérera comme texte
      localisation: this.salleToUpdate?.localisation || '',
      etat: this.salleToUpdate?.etat || 'Disponible',
      photo: this.salleToUpdate?.photo || ''
    });
  }

  /**
   * Met à jour la salle.
   */
  update(): void {
    if (this.form.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.loading = true;
    const salleData = this.form.value;
    
    // Convertir la capacité en nombre avant l'envoi
    salleData.capacite = parseInt(salleData.capacite, 10);

    // L'ID de la salle est dans this.salleToUpdate.id_salle
    this.salleService.updateSalle(this.salleToUpdate?.id_salle, salleData).subscribe({
      next: (response: any) => {
        if (response.success) {
          Alertes.alerteAddSuccess('Salle modifiée avec succès');
          this.emitSubmit();
        } else {
          Alertes.alerteAddDanger(response.message || 'Erreur lors de la modification');
        }
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Erreur lors de la modification', error);
        Alertes.alerteAddDanger(error?.error?.message || 'Erreur lors de la mise à jour de la salle');
        this.loading = false;
      },
      complete: () => {
        this.close();
      }
    });
  }

  /**
   * Marque tous les champs comme touchés pour afficher les erreurs.
   */
  markFormGroupTouched(): void {
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Vérifie si un champ a des erreurs.
   */
  hasError(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  /**
   * Obtient le message d'erreur pour un champ.
   */
  getErrorMessage(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return `${fieldName} est requis`;
      if (field.errors['minlength']) return `${fieldName} doit contenir au moins ${field.errors['minlength'].requiredLength} caractères`;
      if (field.errors['min']) return `${fieldName} doit être supérieur ou égal à ${field.errors['min'].min}`;
      if (field.errors['pattern']) return `${fieldName} doit être un nombre entier valide`;
    }
    return '';
  }

  emitSubmit(): void {
    this.submit.emit(true);
  }

  close(): void {
    this.modalService.dismissAll();
  }
  
  // Cette méthode n'est pas pertinente pour l'édition mais est incluse pour être complète (comme dans AddUserComponent)
  doSearch(): void {
    const searchCriteria = this.form.value;
    Object.keys(searchCriteria).forEach(key => {
      if (!searchCriteria[key] || searchCriteria[key] === '') {
        delete searchCriteria[key];
      }
    });
    this.search.emit(searchCriteria);
  }
}