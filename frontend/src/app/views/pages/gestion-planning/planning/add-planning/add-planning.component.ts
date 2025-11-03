
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PlanningService } from 'src/app/services/planning/planning.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Alertes } from 'src/app/util/alerte';
import { UserService } from 'src/app/services/user/user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-planning',
  templateUrl: './add-planning.component.html',
  styleUrls: ['./add-planning.component.scss']
})
export class AddPlanningComponent implements OnInit {
  form!: FormGroup;
  @Output() submit: EventEmitter<boolean> = new EventEmitter();
  @Output() search: EventEmitter<any> = new EventEmitter();
  @Input() isSearch: boolean = false;

  classes: any[] = [];
  cours: any[] = [];
  salles: any[] = [];
  users: any[] = [];
  loading = false;
  id_classe : any;

  constructor(
    private planningService: PlanningService,
    private route: ActivatedRoute, 
    private userService : UserService, 
    private modalService: NgbModal) {}

  ngOnInit() {
    this.id_classe = parseInt(this.route.snapshot.paramMap.get('id_classe') || '0', 10);
    this.initForm();
    this.loadOptions();
  }

  loadOptions() {
    this.planningService.getClasses().subscribe((res: any) => this.classes = res.data || res);
    this.planningService.getCours().subscribe((res: any) => this.cours = res.data || res);
    this.planningService.getSalles().subscribe((res: any) => this.salles = res.data || res);
   this.loadUsers();
 }

  initForm(): void {
    this.form = new FormGroup({
      id_classe: new FormControl(this.id_classe, Validators.required),
      id_cours: new FormControl('', Validators.required),
      id_salle: new FormControl('', Validators.required),
      id_user: new FormControl('', Validators.required),
      date_debut: new FormControl('', Validators.required),
      date_fin: new FormControl('', Validators.required),
      description: new FormControl('', Validators.maxLength(500)),
    });
  }

  loadUsers() : any {
    this.userService.getUsers().subscribe({
      next: (res) => {
        console.log('Recruteur récupérés :', res.data);

        this.users = res.data.map((user: any) => ({
          ...user,
          fullName: `${user.prenom} ${user.nom}`,
          id_user: user.id,
        })).filter((user : any) => user.role.nom === 'Enseignant');
      }
  })
  }

  create(): void {
    if (this.form.invalid) return;
    this.loading = true;
    const payload = this.form.value;
    this.planningService.createPlanning(payload).subscribe({
      next: (res) => {
        console.log('donnees saisie : ',res )
        Alertes.alerteAddSuccess('Planning ajouté avec succès');
        this.submit.emit(true);
        this.close();
      },
      error: (err: any) => {
        if (err.status === 409 && err.error?.error) {
          Alertes.alerteAddDanger(err.error.error);
        } else {
          Alertes.alerteAddDanger(err?.error?.message || 'Erreur lors de l’ajout');
        }
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  doSearch(): void {
    if (this.form.invalid) return;
    this.search.emit(this.form.value);
    this.close();
  }

  close(): void {
    this.modalService.dismissAll();
  }
}
