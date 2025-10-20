import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Alertes } from 'src/app/util/alerte';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/user/user.service';
import { ClasseService } from 'src/app/services/classe/classe.service';
import { FiliereService } from 'src/app/services/filiere/filiere.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {

  message = '';
  roles: any[] = [];
  filieres: any[] = [];
  classes: any[] = [];
  filteredClasses: any[] = [];
  loading = false;

  form!: FormGroup;
  @Output() submit: EventEmitter<boolean> = new EventEmitter();
  @Output() search: EventEmitter<any> = new EventEmitter();
  @Input() userToUpdate: any;
  @Input() isSearch: boolean = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private classeService: ClasseService,
    private filiereService: FiliereService,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadRoles();
    this.loadFilieres();
    this.loadClasses();

    if (this.isSearch) this.initSearchForm();
    else this.initForm();

    // 🔹 écoute des changements de filières
    if (!this.isSearch) {
      this.form.get('filieres')?.valueChanges.subscribe((selectedFilieres: number[]) => {
        this.updateFilteredClasses(selectedFilieres);
      });
    }
  }

  /** Charger les rôles */
  loadRoles(): void {
    this.userService.getRoles().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.roles = res.data.map((r: any) => ({ value: r.id, label: r.nom }));
        }
      },
      error: () => {
        this.roles = [
          { value: 1, label: 'Admin' },
          { value: 2, label: 'Enseignant' },
          { value: 3, label: 'Étudiant' }
        ];
      }
    });
  }

  /** Charger toutes les filières */
  loadFilieres(): void {
    this.filiereService.getFilieres().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.filieres = res.data.map((f: any) => ({
            value: f.id_filiere,
            label: f.nom
          }));
        }
      }
    });
  }

  /** Charger toutes les classes */
  loadClasses(): void {
    this.classeService.getClasses().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.classes = res.data.map((c: any) => ({
            value: c.id_classe,
            label: c.nom,
            id_filiere: c.id_filiere
          }));
        }
      }
    });
  }

  /** Met à jour les classes selon les filières sélectionnées */
  updateFilteredClasses(selectedFilieres: number[]): void {
    if (selectedFilieres && selectedFilieres.length > 0) {
      this.filteredClasses = this.classes.filter(c =>
        selectedFilieres.includes(c.id_filiere)
      );
    } else {
      this.filteredClasses = [];
    }

    // reset les classes déjà sélectionnées
    this.form.patchValue({ classes: [] });
  }

  /** Formulaire de création */
  initForm() {
    this.form = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      password_confirmation: ['', [Validators.required]],
      role_id: ['', Validators.required],
      filieres: [[], Validators.required],
      classes: [[], Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  /** Formulaire de recherche */
  initSearchForm() {
    this.form = this.fb.group({
      nom: [''],
      prenom: [''],
      email: [''],
      role_id: [''],
      filiere_id: [''],
      classe_id: ['']
    });
  }

  /** Vérifie la correspondance des mots de passe */
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('password_confirmation');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  /** Création d'un utilisateur */
  create(): void {
    if (this.form.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.loading = true;
    const userData = this.form.value;

    this.authService.register(userData).subscribe({
      next: (res: any) => {
        if (res.success) {
          Alertes.alerteAddSuccess('Utilisateur créé avec succès');
          this.emitSubmit();
        } else {
          Alertes.alerteAddDanger(res.message || 'Erreur lors de la création');
        }
        this.loading = false;
      },
      error: (err) => {
        Alertes.alerteAddDanger(err.error?.message || 'Erreur lors de la création');
        this.loading = false;
      },
      complete: () => this.close()
    });
  }

  /** Recherche */
  doSearch(): void {
    const searchCriteria = this.form.value;
    Object.keys(searchCriteria).forEach(key => {
      if (!searchCriteria[key]) delete searchCriteria[key];
    });
    this.search.emit(searchCriteria);
  }

  markFormGroupTouched(): void {
    Object.values(this.form.controls).forEach(c => c.markAsTouched());
  }

  hasError(field: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getErrorMessage(field: string): string {
    const ctrl = this.form.get(field);
    if (ctrl?.errors) {
      if (ctrl.errors['required']) return `${field} est requis`;
      if (ctrl.errors['email']) return 'Email invalide';
      if (ctrl.errors['minlength']) return `${field} doit contenir au moins ${ctrl.errors['minlength'].requiredLength} caractères`;
      if (ctrl.errors['passwordMismatch']) return 'Les mots de passe ne correspondent pas';
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
