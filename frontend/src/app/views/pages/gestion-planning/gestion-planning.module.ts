import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GestionPlanningRoutingModule } from './gestion-planning-routing.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { NgbDropdownModule, NgbModule, NgbNavModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [],
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
    FormsModule
  ]
})
export class GestionPlanningModule { }
