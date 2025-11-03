import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReserverSalleComponent } from './reserver-salle/reserver-salle.component';
import { HistoriquesComponent } from './historiques/historiques.component';
import { EmploieDuTempsComponent } from './emploie-du-temps/emploie-du-temps.component';
import { MesReservationsComponent } from './mes-reservations/mes-reservations.component';
import { DetailSalleComponent } from './detail-salle/detail-salle.component';

const routes: Routes = [
  {path: '' , component : ReserverSalleComponent},
  {path: 'reserver-salles' , component : ReserverSalleComponent},
  {path: 'reserver-salles/details/:id' , component : DetailSalleComponent},
  {path: 'mes-reservations' , component : MesReservationsComponent },
  {path: 'historiques' , component : HistoriquesComponent},
  {path: 'emploi-du-temps' , component : EmploieDuTempsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionReservationRoutingModule { }
