import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../gestion-admin/dashboard/dashboard/dashboard.component';
import { ListPlanningComponent } from './planning/list-planning/list-planning.component';
import { AddPlanningComponent } from './planning/add-planning/add-planning.component';
import { EditPlanningComponent } from './planning/edit-planning/edit-planning.component';
import { ListRoleComponent } from '../gestion-admin/role/list-role/list-role.component';
import { AddRoleComponent } from '../gestion-admin/role/add-role/add-role.component';
import { EditRoleComponent } from '../gestion-admin/role/edit-role/edit-role.component';
import { InfosPlanningComponent } from './planning/infos-planning/infos-planning.component';
import { PlanningDetailsComponent } from './planning/planning-details/planning-details.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'dashboard', component: DashboardComponent },

  { path: 'planning', component: ListPlanningComponent },
  { path: 'planning/add', component: AddPlanningComponent },
  { path: 'planning', component: EditPlanningComponent },
  { path: 'planning', component: InfosPlanningComponent },
  { path: 'planning/details/:id', component: PlanningDetailsComponent },

  { path: 'roles', component: ListRoleComponent },
  { path: 'roles/add', component: AddRoleComponent },
  { path: 'roles/edit/:id', component: EditRoleComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionPlanningRoutingModule { }
