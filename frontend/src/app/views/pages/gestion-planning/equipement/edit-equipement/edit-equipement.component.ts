import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Alertes } from 'src/app/util/alerte';
import { EquipementService } from 'src/app/services/equipement/equipement.service';
import { SalleService } from 'src/app/services/salle/salle.service';

@Component({
  selector: 'app-edit-equipement',
  templateUrl: './edit-equipement.component.html',
  styleUrls: ['./edit-equipement.component.scss']
})
export class EditEquipementComponent implements OnInit {

  form!: FormGroup;
  
  // ✅ AJOUTS pour la logique de recherche (comme dans EditUserComponent)
  @Output() submit: EventEmitter<boolean> = new EventEmitter();
  @Output() search: EventEmitter<any> = new EventEmitter();
  @Input() isSearch: boolean = false;
  
  // Renommage pour cohérence et simplification si nécessaire, 
  // mais l'original @Input() equipementToUpdate est maintenu.
  @Input() equipementToUpdate: any; 

  salles: any[] = [];
  loading = false;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private equipementService: EquipementService,
    private salleService: SalleService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadSalles();
    
    // Charger les champs UNIQUEMENT si c'est une édition
    if (!this.isSearch) {
      this.loadFields();
    }
    
    // Ajuster les validateurs pour la recherche
    this.setupFormValidators();
  }

  /**
   * Ajuste les validateurs et les valeurs par défaut si c'est une recherche.
   * La recherche ne doit pas nécessiter de champs obligatoires.
   */
  setupFormValidators(): void {
    if (this.isSearch) {
      // Pour la recherche, on retire tous les validateurs requis
      this.form.get('nom')?.clearValidators();
      this.form.get('quantite')?.clearValidators();
      this.form.get('id_salle')?.clearValidators();
      
      // On met à jour la valeur par défaut pour la quantité à null (pour ne pas chercher 'quantite=1')
      this.form.get('quantite')?.setValue(null);
      
      // Mettre à jour la validité du formulaire après avoir retiré les validateurs
      this.form.updateValueAndValidity();
    }
  }

  /**
   * Initialise le formulaire (Logique inchangée pour les champs)
   */
  initForm(): void {
    this.form = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      quantite: [1, [Validators.required, Validators.min(1)]],
      description: [''],
      id_salle: [null, Validators.required]
    });
  }

  /**
   * Charge la liste des salles (Logique inchangée)
   */
  loadSalles(): void {
    this.salleService.getSalles().subscribe({
      next: (response: any) => {
        // NOTE: Assurez-vous que la réponse est un tableau d'objets ou ajustez le mapping ici
        // J'utilise le format `value/label` pour la cohérence avec ListeUsersComponent
        if (response.success) {
            this.salles = response.data.map((salle: any) => ({
                value: salle.id_salle,
                label: salle.nom
            }));
        } else {
            this.salles = response; // Si la réponse est déjà le tableau de salles
        }
      },
      error: (err) => {
        console.error('Erreur lors du chargement des salles', err);
        Alertes.alerteAddDanger('Erreur lors du chargement des salles.');
      }
    });
  }

  /**
   * Charge les valeurs à modifier (Logique inchangée)
   */
  loadFields(): void {
    if (!this.equipementToUpdate) return;

    this.form.patchValue({
      nom: this.equipementToUpdate?.nom || '',
      quantite: this.equipementToUpdate?.quantite || 1,
      description: this.equipementToUpdate?.description || '',
      // Assurez-vous que l'ID de la salle est correctement extrait
      id_salle: this.equipementToUpdate?.id_salle || this.equipementToUpdate?.salle?.id_salle || null
    });
  }

  /**
   * Soumet le formulaire : met à jour ou lance la recherche
   * (Logique unifiée comme dans EditUserComponent)
   */
  submitForm(): void {
    if (this.isSearch) {
      this.doSearch();
    } else {
      this.update();
    }
  }

  /**
   * Met à jour un équipement (Logique inchangée, utilisée si !isSearch)
   */
  update(): void {
    if (this.form.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.loading = true;
    const equipementData = this.form.value;

    this.equipementService.updateEquipment(this.equipementToUpdate.id, equipementData).subscribe({
      next: (response: any) => {
        Alertes.alerteAddSuccess('Équipement modifié avec succès.');
        this.emitSubmit();
        this.close();
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Erreur lors de la mise à jour', error);
        Alertes.alerteAddDanger('Erreur lors de la mise à jour de l’équipement.');
        this.loading = false;
      }
    });
  }
  
  /**
   * Effectue une recherche (Méthode AJOUTÉE)
   * (Logique identique à doSearch dans EditUserComponent)
   */
  doSearch(): void {
    const searchCriteria = this.form.value;
    
    // Nettoyer les valeurs vides (très important pour les critères de recherche)
    Object.keys(searchCriteria).forEach(key => {
      if (!searchCriteria[key] && searchCriteria[key] !== 0) {
        delete searchCriteria[key];
      }
    });
    
    this.search.emit(searchCriteria);
  }


  // --- Méthodes utilitaires (inchangées) ---

  /**
   * Marque tous les champs comme touchés
   */
  markFormGroupTouched(): void {
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Vérifie si un champ a une erreur
   */
  hasError(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    // Pour la recherche, on ne vérifie pas les erreurs de validation
    if (this.isSearch) return false;
    
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  /**
   * Récupère le message d’erreur d’un champ (Logique légèrement corrigée pour le nom des champs)
   */
  getErrorMessage(fieldName: string): string {
    // Si c'est une recherche, on ne renvoie pas d'erreur
    if (this.isSearch) return '';
    
    const field = this.form.get(fieldName);
    if (field?.errors) {
      const displayName = fieldName === 'id_salle' ? 'La salle' : fieldName;
      
      if (field.errors['required']) return `${displayName} est requis`;
      if (field.errors['min']) return `${displayName} doit être supérieur à 0`;
      if (field.errors['minlength'])
        return `${displayName} doit contenir au moins ${field.errors['minlength'].requiredLength} caractères`;
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