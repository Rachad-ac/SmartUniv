import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Alertes } from 'src/app/util/alerte';
import { AuthService } from 'src/app/services/auth/auth.service';



@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {

  message = '';
  roles: any = [
    { value: 'Etudiant', label: 'Etudiant' },
    { value: 'Enseignant', label: 'Enseignant' },
  ];

  form!: FormGroup;
  @Output() submit: EventEmitter<boolean> = new EventEmitter();
  @Output() search: EventEmitter<boolean> = new EventEmitter();
  @Input() userToUpdate: any;
  @Input() isSearch: any;

  constructor(
    private authService: AuthService, 
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
     // 2. 💡 DÉMARRAGE : Appel la méthode d'initialisation appropriée
    if (this.isSearch) {
      this.initSearchForm();
    } else {
      this.initForm();
    }
  }
  
  initSearchForm() {
    this.form = this.fb.group({
      nom: [''],         
      prenom: [''],
      email: [''],
      password: [''],   
      password_confirmation: [''], 
      role: [''],
    });
  }

  initForm() {
    this.form = new FormGroup({
      nom: new FormControl('', Validators.required),
      prenom: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.minLength(8)),
      password_confirmation: new FormControl('', Validators.minLength(8)),
      role: new FormControl('', Validators.required),
    });
  }

  create(): void {
    const user = this.form.value;

    if (user.password !== user.password_confirmation) {
      this.message = "Les mots de passe ne correspondent pas.";
      return;
    }

    this.authService.register(user).subscribe({
      next: () => {
        Alertes.alerteAddSuccess('User ajoutée avec succès');
        this.emitSubmit();
        console.log(user);
      },
      error: (err) => {
        Alertes.alerteAddDanger(err.error.message || 'Erreur lors de l’ajout');
      },
      complete: () => {
        this.close();
      }
    });
  }

  doSearch(): void {
    this.search.emit(this.form.value);
  }

  emitSubmit(): void {
    this.submit.emit(true);
  }

  close(): void {
    this.modalService.dismissAll();
  }

}