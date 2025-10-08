
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PlanningService } from 'src/app/services/planning/planning.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Alertes } from 'src/app/util/alerte';
import { Helper } from 'src/app/util/helper';

@Component({
  selector: 'app-edit-planning',
  templateUrl: './edit-planning.component.html',
  styleUrls: ['./edit-planning.component.scss']
})
export class EditPlanningComponent implements OnInit {
  form!: FormGroup;
  @Output() submit: EventEmitter<boolean> = new EventEmitter();
  @Input() planningToUpdate: any;
  classes: any[] = [];
  cours: any[] = [];
  salles: any[] = [];
  loading = false;

  constructor(private planningService: PlanningService, private modalService: NgbModal) {}

  ngOnInit() {
    this.initForm();
    this.loadOptions();
    this.loadFields();
  }

  loadOptions() {
    this.planningService.getClasses().subscribe((res: any) => this.classes = res.data || res);
    this.planningService.getCours().subscribe((res: any) => this.cours = res.data || res);
    this.planningService.getSalles().subscribe((res: any) => this.salles = res.data || res);
  }

  initForm(): void {
    this.form = new FormGroup({
      id_classe: new FormControl(''),
      id_cours: new FormControl(''),
      id_salle: new FormControl(''),
      date_debut: new FormControl(''),
      date_fin: new FormControl(''),
      description: new FormControl(''),
    });
  }

  loadFields() {
    if (this.planningToUpdate !== undefined) {
      this.form?.get('id_classe')?.setValue(this.planningToUpdate?.id_classe);
      this.form?.get('id_cours')?.setValue(this.planningToUpdate?.id_cours);
      this.form?.get('id_salle')?.setValue(this.planningToUpdate?.id_salle);
      this.form?.get('date_debut')?.setValue(Helper.editDate(this.planningToUpdate?.date_debut));
      this.form?.get('date_fin')?.setValue(Helper.editDate(this.planningToUpdate?.date_fin));
      this.form?.get('desc')?.setValue(this.planningToUpdate?.desc);
    }
  }

  update(): void {
    if (this.form.invalid) return;
    this.loading = true;
    const payload = this.form.value;
    const id = this.planningToUpdate?.id_planning || this.planningToUpdate?.id;
    this.planningService.updatePlanning(id, payload).subscribe({
      next: () => {
        Alertes.alerteAddSuccess('Modification réussie');
        this.submit.emit(true);
        this.close();
      },
      error: (err: any) => {
        if (err.status === 409 && err.error?.error) {
          Alertes.alerteAddDanger(err.error.error);
        } else {
          Alertes.alerteAddDanger(err?.error?.message || 'Erreur lors de la mise à jour');
        }
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  close(): void {
    this.modalService.dismissAll();
  }
}
