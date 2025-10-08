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


@NgModule({
  declarations: [
    ListPlanningComponent,
    AddPlanningComponent,
    EditPlanningComponent,
    InfosPlanningComponent,
    PlanningDetailsComponent
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
