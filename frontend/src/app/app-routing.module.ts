import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BaseComponent } from './views/layout/base/base.component';
import { AuthGuard } from './core/guard/auth.guard';
import { ErrorPageComponent } from './views/pages/error-page/error-page.component';
import { RoleGuard } from './core/guard/role.guard';


const routes: Routes = [
  { path:'', loadChildren: () => import('./views/pages/auth/auth.module').then(m => m.AuthModule) },
  {
    path: 'admin',
    component: BaseComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: 'Admin' },
    children: [
      {
        path: 'gestion-admin',
        loadChildren: () => import('./views/pages/gestion-admin/gestion-admin.module').then(m => m.GestionAdminModule)
      },
      {
        path: 'gestion-planning',
        loadChildren: () => import('./views/pages/gestion-planning/gestion-planning.module').then(m => m.GestionPlanningModule)
      },
    ]
  },
  {
    path: 'users',
    component: BaseComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: ['Etudiant', 'Enseignant']},
    children: [
      {
        path: 'gestion-reservation',
        loadChildren: () => import('./views/pages/gestion-reservation/gestion-reservation.module').then(m => m.GestionReservationModule)
      }
    ]
  },

  {
    path: 'error',
    component: ErrorPageComponent,
    data: {
      'type': 404,
      'title': 'Page Not Found',
      'desc': 'Oopps!! The page you were looking for doesn\'t exist.'
    }
  },
  {
    path: 'error/:type',
    component: ErrorPageComponent
  },
  { path: '**', redirectTo: 'error', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
