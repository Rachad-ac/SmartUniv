import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Alertes } from 'src/app/util/alerte';
import { RoleService } from 'src/app/services/role/role.service';

@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.scss']
})
export class AddRoleComponent implements OnInit {

  form!: FormGroup;
  @Output() submit: EventEmitter<boolean> = new EventEmitter();
  @Output() search: EventEmitter<boolean> = new EventEmitter();
  @Input() roleToUpdate: any;
  @Input() isSearch: any;

  constructor(
    private modalService: NgbModal,
    private roleService: RoleService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.form = new FormGroup({
      role: new FormControl('', Validators.required),
      desc: new FormControl('', Validators.maxLength(500)),
    });
  }

  create(): void {
    const role = this.form.value;
    this.roleService.createRole(role).subscribe({
      next: () => {
        Alertes.alerteAddSuccess('Rôle ajouté avec succès');
        this.emitSubmit();
      },
      error: (err: any) => {
        Alertes.alerteAddDanger(err?.error?.message || 'Erreur lors de l’ajout');
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
