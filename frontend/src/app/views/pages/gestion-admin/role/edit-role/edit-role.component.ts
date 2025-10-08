import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Alertes } from 'src/app/util/alerte';
import { RoleService } from 'src/app/services/role/role.service';

@Component({
  selector: 'app-edit-role',
  templateUrl: './edit-role.component.html',
  styleUrls: ['./edit-role.component.scss']
})
export class EditRoleComponent implements OnInit {

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
    this.loadFields();
  }

  initForm(): void {
    this.form = new FormGroup({
      nom: new FormControl(''),
      description: new FormControl(''),
    });
  }

  loadFields(): void {
    if (this.roleToUpdate !== undefined) {
      this.form?.get('nom')?.setValue(this.roleToUpdate?.nom);
      this.form?.get('description')?.setValue(this.roleToUpdate?.description);
    }
  }

  update(): void {
    const rolePayload = this.form.value;
    this.roleService.updateRole(this.roleToUpdate?.id, rolePayload).subscribe({
      next: () => {
        Alertes.alerteAddSuccess('Enregistrement réussi');
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
