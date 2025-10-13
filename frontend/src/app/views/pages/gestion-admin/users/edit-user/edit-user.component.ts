import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Alertes } from 'src/app/util/alerte';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {

  form!: FormGroup;
  @Output() submit: EventEmitter<boolean> = new EventEmitter();
  @Output() search: EventEmitter<any> = new EventEmitter();
  @Input() userToUpdate: any;
  @Input() isSearch: boolean = false;

  roles: any[] = [];
  loading = false;

  constructor(
    private modalService: NgbModal,
    private userService: UserService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadRoles();
    this.initForm();
    this.loadFields();
  }

  /**
   * Charge les rôles disponibles
   */
  loadRoles(): void {
    this.userService.getRoles().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.roles = response.data.map((role: any) => ({
            value: role.id,
            label: role.nom
          }));
        }
      },
      error: (err) => {
        console.error('Erreur lors du chargement des rôles', err);
        // Rôles par défaut en cas d'erreur
        this.roles = [
          { value: 1, label: 'Admin' },
          { value: 2, label: 'Enseignant' },
          { value: 3, label: 'Étudiant' }
        ];
      }
    });
  }

  /**
   * Initialise le formulaire
   */
  initForm(): void {
    this.form = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      role_id: ['', Validators.required],
      password: ['', [Validators.minLength(8)]],
      password_confirmation: ['']
    }, { validators: this.passwordMatchValidator });
  }

  /**
   * Validateur personnalisé pour vérifier la correspondance des mots de passe
   */
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('password_confirmation');
    
    if (password && confirmPassword && password.value && confirmPassword.value && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  /**
   * Charge les données de l'utilisateur à modifier
   */
  loadFields(): void {
    if (!this.userToUpdate) { return; }
    
    this.form.patchValue({
      nom: this.userToUpdate?.nom || '',
      prenom: this.userToUpdate?.prenom || '',
      email: this.userToUpdate?.email || '',
      role_id: this.userToUpdate?.role_id || this.userToUpdate?.role?.id || ''
    });
  }

  /**
   * Met à jour l'utilisateur
   */
  update(): void {
    if (this.form.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.loading = true;
    const userData = this.form.value;

    // Supprimer les champs vides pour la mise à jour
    if (!userData.password) {
      delete userData.password;
      delete userData.password_confirmation;
    }

    this.userService.updateUser(this.userToUpdate?.id, userData).subscribe({
      next: (response: any) => {
        if (response.success) {
          Alertes.alerteAddSuccess('Utilisateur modifié avec succès');
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
   * Effectue une recherche
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
      if (field.errors['required']) return `${fieldName} est requis`;
      if (field.errors['email']) return 'Email invalide';
      if (field.errors['minlength']) return `${fieldName} doit contenir au moins ${field.errors['minlength'].requiredLength} caractères`;
      if (field.errors['passwordMismatch']) return 'Les mots de passe ne correspondent pas';
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
