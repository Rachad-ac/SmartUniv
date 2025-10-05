import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListeUsersComponent } from './users/liste-users/liste-users.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { AddUserComponent } from './users/add-user/add-user/add-user.component';

const routes: Routes = [
  //declaration des routes ici amin
  {path: '' , component : DashboardComponent},
  { path: 'dashboard', component: DashboardComponent},
  {path: 'users' , component : ListeUsersComponent},
  {path: 'users' , component : AddUserComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionAdminRoutingModule { }
