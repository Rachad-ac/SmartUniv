import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GestionReservationRoutingModule } from './gestion-reservation-routing.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { NgbDropdownModule, NgbModule, NgbNavModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { RouterModule } from '@angular/router';
import { ReserverSalleComponent } from './reserver-salle/reserver-salle.component';
import { HistoriquesComponent } from './historiques/historiques.component';
import { MesReservationsComponent } from './mes-reservations/mes-reservations.component';
import { EmploieDuTempsComponent } from './emploie-du-temps/emploie-du-temps.component';
import { DetailSalleComponent } from './detail-salle/detail-salle.component';
import { FullCalendarModule } from '@fullcalendar/angular';


@NgModule({
  declarations: [
    ReserverSalleComponent,
    HistoriquesComponent,
    MesReservationsComponent,
    EmploieDuTempsComponent,
    DetailSalleComponent,
  ],
  imports: [
    CommonModule,
    GestionReservationRoutingModule,
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
    FullCalendarModule
  ]
})
export class GestionReservationModule { }
