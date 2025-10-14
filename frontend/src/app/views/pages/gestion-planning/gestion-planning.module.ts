import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { GestionPlanningRoutingModule } from './gestion-planning-routing.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { NgbDropdownModule, NgbModule, NgbNavModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { RouterModule } from '@angular/router';
import { ListPlanningComponent } from './planning/list-planning/list-planning.component';
import { AddPlanningComponent } from './planning/add-planning/add-planning.component';
import { EditPlanningComponent } from './planning/edit-planning/edit-planning.component';
import { InfosPlanningComponent } from './planning/infos-planning/infos-planning.component';
import { PlanningDetailsComponent } from './planning/planning-details/planning-details.component';
import { ListSalleComponent } from './salle/list-salle/list-salle.component';
import { AddSalleComponent } from './salle/add-salle/add-salle.component';
import { EditSalleComponent } from './salle/edit-salle/edit-salle.component';
import { ListFiliereComponent } from './filiere/list-filiere/list-filiere.component';
import { AddFiliereComponent } from './filiere/add-filiere/add-filiere.component';
import { EditFiliereComponent } from './filiere/edit-filiere/edit-filiere.component';
import { ListMatiereComponent } from './matiere/list-matiere/list-matiere.component';
import { AddMatiereComponent } from './matiere/add-matiere/add-matiere.component';
import { EditMatiereComponent } from './matiere/edit-matiere/edit-matiere.component';
import { ListClasseComponent } from './classe/list-classe/list-classe.component';
import { AddClasseComponent } from './classe/add-classe/add-classe.component';
import { EditClasseComponent } from './classe/edit-classe/edit-classe.component';
import { ListEquipementComponent } from './equipement/list-equipement/list-equipement.component';
import { AddEquipementComponent } from './equipement/add-equipement/add-equipement.component';
import { EditEquipementComponent } from './equipement/edit-equipement/edit-equipement.component';
import { ListCoursComponent } from './cours/list-cours/list-cours.component';
import { AddCoursComponent } from './cours/add-cours/add-cours.component';
import { EditCoursComponent } from './cours/edit-cours/edit-cours.component';
import { ListResevationComponent } from './reservation/list-resevation/list-resevation.component';


@NgModule({
  declarations: [
    ListPlanningComponent,
    AddPlanningComponent,
    EditPlanningComponent,
    InfosPlanningComponent,
    PlanningDetailsComponent,
    ListSalleComponent,
    AddSalleComponent,
    EditSalleComponent,
    ListFiliereComponent,
    AddFiliereComponent,
    EditFiliereComponent,
    ListMatiereComponent,
    AddMatiereComponent,
    EditMatiereComponent,
    ListClasseComponent,
    AddClasseComponent,
    EditClasseComponent,
    ListEquipementComponent,
    AddEquipementComponent,
    EditEquipementComponent,
    ListCoursComponent,
    AddCoursComponent,
    EditCoursComponent,
    ListResevationComponent,
  ],
  imports: [
    CommonModule,
    GestionPlanningRoutingModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTableModule,
    NgbPaginationModule,
    NgbNavModule,
    NgbDropdownModule,
    NgbModule,
    ReactiveFormsModule,
    NgSelectModule,
    RouterModule,
    FormsModule,
    FullCalendarModule,
  ]
})
export class GestionPlanningModule { }
