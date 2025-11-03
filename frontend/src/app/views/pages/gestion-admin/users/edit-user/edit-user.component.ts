import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Alertes } from 'src/app/util/alerte';
import { UserService } from 'src/app/services/user/user.service';
import { FiliereService } from 'src/app/services/filiere/filiere.service';
import { ClasseService } from 'src/app/services/classe/classe.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {

  form!: FormGroup;
  @Output() submit: EventEmitter<boolean> = new EventEmitter();
  @Input() userToUpdate: any;
  @Input() isSearch: boolean = false;

  roles: any[] = [];
  filieres: any[] = [];
  classes: any[] = [];
  filteredClasses: any[] = [];

  loading = false;

  constructor(
    private modalService: NgbModal,
    private userService: UserService,
    private filiereService: FiliereService,
    private classeService: ClasseService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadRoles();
    this.loadFilieres();
    this.loadClasses();
    this.initForm();

    // 🔹 Filtrage automatique des classes selon la filière sélectionnée
    this.form.get('filieres')?.valueChanges.subscribe((filiereIds: number[]) => {
      if (filiereIds?.length) {
        this.filteredClasses = this.classes.filter(c => filiereIds.includes(c.filiere_id));
      } else {
        this.filteredClasses = [];
      }
      // Réinitialiser la sélection des classes
      this.form.patchValue({ classes: [] });
    });

    this.loadFields();
  }

  /** Initialisation du formulaire */
  initForm(): void {
    this.form = this.fb.group({
      nom: [''],
      prenom: [''],
      email: [''],
      role_id: [''],
      filieres: [[]], // 🔹 tableau d'IDs
      classes: [[]],  // 🔹 tableau d'IDs
      password: [''],
      password_confirmation: ['']
    }, { validators: this.passwordMatchValidator });
  }

  /** Validateur de correspondance des mots de passe */
  passwordMatchValidator(form: FormGroup) {
    const pass = form.get('password')?.value;
    const confirm = form.get('password_confirmation')?.value;
    return pass && confirm && pass !== confirm ? { passwordMismatch: true } : null;
  }

  /** Chargement des rôles */
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

  /** Chargement des filières */
  loadFilieres(): void {
    this.filiereService.getFilieres().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.filieres = res.data.map((f: any) => ({ value: f.id_filiere, label: f.nom }));
        }
      },
      error: () => Alertes.alerteAddDanger('Erreur lors du chargement des filières')
    });
  }

  /** Chargement des classes */
  loadClasses(): void {
    this.classeService.getClasses().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.classes = res.data.map((c: any) => ({
            value: c.id_classe,
            label: c.nom,
            filiere_id: c.id_filiere
          }));
        }
      },
      error: () => Alertes.alerteAddDanger('Erreur lors du chargement des classes')
    });
  }

  /** Pré-remplir le formulaire avec les données existantes */
  loadFields(): void {
    if (!this.userToUpdate) return;

    this.form.patchValue({
      nom: this.userToUpdate.nom,
      prenom: this.userToUpdate.prenom,
      email: this.userToUpdate.email,
      role_id: this.userToUpdate.role_id || this.userToUpdate.role?.id,
      filieres: this.userToUpdate.filieres?.map((f: any) => f.id_filiere) || [],
      classes: this.userToUpdate.classes?.map((c: any) => c.id_classe) || []
    });
  }

  /** Mettre à jour l'utilisateur */
  update(): void {
    if (this.form.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.loading = true;
    const data = { ...this.form.value };

    // Supprimer les mots de passe si vide
    if (!data.password) {
      delete data.password;
      delete data.password_confirmation;
    }

    this.userService.updateUser(this.userToUpdate.id, data).subscribe({
      next: (res: any) => {
        if (res.success) {
          Alertes.alerteAddSuccess('Utilisateur mis à jour avec succès');
          this.submit.emit(true);
          this.close();
        } else {
          Alertes.alerteAddDanger(res.message || 'Erreur lors de la mise à jour');
        }
      },
      error: (err) => {
        console.error(err);
        Alertes.alerteAddDanger('Erreur serveur');
      },
      complete: () => this.loading = false
    });
  }

  /** Helpers */
  markFormGroupTouched(): void {
    Object.keys(this.form.controls).forEach(key => {
      this.form.get(key)?.markAsTouched();
    });
  }

  hasError(field: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getErrorMessage(field: string): string {
    const control = this.form.get(field);
    if (!control?.errors) return '';
    if (control.errors['required']) return `${field} est requis`;
    if (control.errors['email']) return 'Email invalide';
    if (control.errors['minlength']) return `${field} doit contenir au moins ${control.errors['minlength'].requiredLength} caractères`;
    if (control.errors['passwordMismatch']) return 'Les mots de passe ne correspondent pas';
    return '';
  }

  close(): void {
    this.modalService.dismissAll();
  }

}
