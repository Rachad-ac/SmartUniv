import { Component, Input, OnInit, Output , EventEmitter} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'; // Changé pour NgbModal
import { Alertes } from 'src/app/util/alerte';
import { EquipementService } from 'src/app/services/equipement/equipement.service';
import { SalleService } from 'src/app/services/salle/salle.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-equipement',
  templateUrl: './add-equipement.component.html',
  styleUrls: ['./add-equipement.component.scss']
})
export class AddEquipementComponent implements OnInit {

  // Entrées/Sorties pour la réutilisation (identiques à AddUserComponent)
  @Input() isSearch: boolean = false; 
  @Output() search = new EventEmitter<any>();
  @Output() submit = new EventEmitter<any>(); 
  @Input() equipement: any; 
  
  form!: FormGroup;
  loading = false;
  salles: any[] = [];
  id_salle : any;

  constructor(
    private fb: FormBuilder,
    // Remplacement de NgbActiveModal par NgbModal pour aligner la méthode close()
    private modalService: NgbModal,
    private route: ActivatedRoute, 
    private equipementService: EquipementService,
    private salleService: SalleService
  ) {}

  ngOnInit(): void {
    this.id_salle = this.route.snapshot.paramMap.get('id_salle');

    this.loadSalles();
    
    // 🚦 Initialisation conditionnelle du formulaire (Logique AddUserComponent)
    if (this.isSearch) {
      this.initSearchForm();
    } else {
      this.initForm();
    }
  }

  /**
   * Initialise le formulaire pour l'AJOUT (avec validations)
   */
  initForm() {
    this.form = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      quantite: [1, [Validators.required, Validators.min(1)]],
      description: [''],
      id_salle: [this.id_salle, Validators.required],
    });
  }

  /**
   * Initialise le formulaire pour la RECHERCHE (sans validations requises)
   */
  initSearchForm() {
    this.form = this.fb.group({
      nom: [''],
      quantite: [null], // Utiliser null pour ne pas inclure 1 par défaut dans la recherche
      description: [''],
      id_salle: [null],
    });
  }

  /**
   * Charge les salles disponibles depuis le backend
   */
  loadSalles() {
    this.salleService.getSalles().subscribe({
      next: (response: any) => {
        // Mappage pour cohérence (s'assurer que le format value/label est utilisé pour le select)
        if (response.success && Array.isArray(response.data)) {
            this.salles = response.data.map((salle: any) => ({
                value: salle.id_salle,
                label: salle.nom
            }));
        } else if (Array.isArray(response)) {
            // Si la réponse est directement un tableau sans le wrapper {success:..., data:...}
            this.salles = response.map((salle: any) => ({
                value: salle.id_salle,
                label: salle.nom
            }));
        }
      },
      error: () => {
        Alertes.alerteAddDanger('Erreur lors du chargement des salles.');
      }
    });
  }

  /**
   * Soumission principale : redirige vers create() ou doSearch()
   */
  submitForm(): void {
    if (this.isSearch) {
      this.doSearch();
    } else {
      this.create();
    }
  }

  /**
   * Crée un équipement (utilisé si isSearch est faux)
   */
  create() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.equipementService.createEquipment(this.form.value).subscribe({
      next: (res) => {
        Alertes.alerteAddSuccess('Équipement ajouté avec succès !');
        this.loading = false;
        this.emitSubmit(); // Utiliser l'Output submit
        this.close(); // Fermer après succès
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        Alertes.alerteAddDanger('Erreur lors de l’enregistrement de l’équipement.');
      }
    });
  }

  /**
   * Effectue une recherche (Méthode ajoutée)
   * (Logique identique à doSearch dans AddUserComponent)
   */
  doSearch(): void {
    const searchCriteria = this.form.value;
    
    // Nettoyer les valeurs nulles, undefined ou vides
    Object.keys(searchCriteria).forEach(key => {
      const value = searchCriteria[key];
      // On garde 0 et les valeurs non vides/non nulles
      if (value === null || value === undefined || value === '') { 
        delete searchCriteria[key];
      }
    });
    
    this.search.emit(searchCriteria);
    this.close(); // Fermer la modale de recherche après l'émission
  }


  // --- Méthodes utilitaires (similaires à AddUserComponent) ---

  /**
   * Émet l'événement de soumission pour rafraîchir la liste parente
   */
  emitSubmit(): void {
    this.submit.emit(true);
  }

  /**
   * Validation simplifiée
   */
  hasError(field: string): boolean {
    // En mode recherche, on n'affiche jamais d'erreur
    if (this.isSearch) return false;
    
    const control = this.form.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  /**
   * Messages d’erreur personnalisés
   */
  getErrorMessage(field: string): string {
    if (this.isSearch) return '';
    
    const control = this.form.get(field);
    if (!control) return '';

    if (control.hasError('required')) return 'Ce champ est obligatoire.';
    if (control.hasError('min')) return 'La quantité doit être supérieure à 0.';
    if (control.hasError('minlength')) return 'Le nom doit contenir au moins 2 caractères.';
    return 'Valeur invalide.';
  }

  /**
   * Fermer la modale
   * (Utilise modalService.dismissAll() comme dans AddUserComponent)
   */
  close() {
    this.modalService.dismissAll();
  }
}
