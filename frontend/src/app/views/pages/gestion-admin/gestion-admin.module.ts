import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GestionAdminRoutingModule } from './gestion-admin-routing.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { NgbDropdownModule, NgbModule, NgbNavModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { RouterModule } from '@angular/router';
import { ListeUsersComponent } from './users/liste-users/liste-users.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { AddUserComponent } from './users/add-user/add-user/add-user.component';
import { EditUserComponent } from './users/edit-user/edit-user.component';


@NgModule({
  declarations: [
    // ajouter les composant de admin ici 
    ListeUsersComponent,
    DashboardComponent,
    AddUserComponent,
    EditUserComponent
  ],
  imports: [
    CommonModule,
    GestionAdminRoutingModule,
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
export class GestionAdminModule { }
