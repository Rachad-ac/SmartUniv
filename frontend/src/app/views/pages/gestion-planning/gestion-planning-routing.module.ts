import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../gestion-admin/dashboard/dashboard/dashboard.component';
import { ListPlanningComponent } from './planning/list-planning/list-planning.component';
import { AddPlanningComponent } from './planning/add-planning/add-planning.component';
import { EditPlanningComponent } from './planning/edit-planning/edit-planning.component';
import { InfosPlanningComponent } from './planning/infos-planning/infos-planning.component';
import { PlanningDetailsComponent } from './planning/planning-details/planning-details.component';
import { ListSalleComponent } from './salle/list-salle/list-salle.component';
import { AddSalleComponent } from './salle/add-salle/add-salle.component';
import { EditSalleComponent } from './salle/edit-salle/edit-salle.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'dashboard', component: DashboardComponent },

  { path: 'planning', component: ListPlanningComponent },
  { path: 'planning', component: AddPlanningComponent },
  { path: 'planning', component: EditPlanningComponent },
  { path: 'planning', component: InfosPlanningComponent },
  { path: 'planning/details/:id_filiere/:id_classe', component: PlanningDetailsComponent },

  { path: 'salles', component: ListSalleComponent },
  { path: 'salles', component: AddSalleComponent },
  { path: 'salles', component: EditSalleComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionPlanningRoutingModule { }
