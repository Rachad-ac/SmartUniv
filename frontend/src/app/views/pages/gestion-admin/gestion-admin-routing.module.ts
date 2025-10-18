import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListeUsersComponent } from './users/liste-users/liste-users.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { EditUserComponent } from './users/edit-user/edit-user.component';
import { ListRoleComponent } from './role/list-role/list-role.component';
import { AddRoleComponent } from './role/add-role/add-role.component';
import { EditRoleComponent } from './role/edit-role/edit-role.component';
import { AddUserComponent } from './users/add-user/add-user.component';

const routes: Routes = [
  //declaration des routes ici amin
  {path: '' , component : DashboardComponent},
  { path: 'dashboard', component: DashboardComponent},

  {path: 'users' , component : ListeUsersComponent},
  {path: 'users' , component : AddUserComponent},
  {path: 'users' , component : EditUserComponent},

  {path: 'roles' , component : ListRoleComponent},
  {path: 'roles' , component : AddRoleComponent},
  {path: 'roles' , component : EditRoleComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionAdminRoutingModule { }
