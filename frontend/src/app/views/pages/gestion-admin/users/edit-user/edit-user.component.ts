import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  @Output() search: EventEmitter<boolean> = new EventEmitter();
  @Input() userToUpdate: any;
  @Input() isSearch: any;

  roles: any = [
    { value: 'Etudiant', label: 'Etudiant' },
    { value: 'Enseignant', label: 'Enseignant' },
  ];

  constructor(
    private modalService: NgbModal,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadFields();
  }

  initForm(): void {
    this.form = new FormGroup({
      nom: new FormControl('', Validators.required),
      prenom: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      role: new FormControl('', Validators.required)
    });
  }

  loadFields(): void {
    if (!this.userToUpdate) { return; }
    this.form?.get('nom')?.setValue(this.userToUpdate?.nom);
    this.form?.get('prenom')?.setValue(this.userToUpdate?.prenom);
    this.form?.get('email')?.setValue(this.userToUpdate?.email);
    this.form?.get('role')?.setValue(this.userToUpdate?.role);
  }

  update(): void {
    const user = this.form.value;
    this.userService.updateUser(this.userToUpdate?.id, user).subscribe({
      next: () => {
        Alertes.alerteAddSuccess('Modification réussie');
        this.emitSubmit();
      },
      error: (error: any) => {
        Alertes.alerteAddDanger(error?.error?.message || 'Erreur lors de la mise à jour');
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
