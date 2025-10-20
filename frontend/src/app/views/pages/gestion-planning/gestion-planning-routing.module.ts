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
import { ListEquipementComponent } from './equipement/list-equipement/list-equipement.component';
import { AddEquipementComponent } from './equipement/add-equipement/add-equipement.component';
import { EditEquipementComponent } from './equipement/edit-equipement/edit-equipement.component';
import { ListResevationComponent } from './reservation/list-resevation/list-resevation.component';
import { ListCoursComponent } from './cours/list-cours/list-cours.component';
import { AddCoursComponent } from './cours/add-cours/add-cours.component';
import { EditCoursComponent } from './cours/edit-cours/edit-cours.component';
import { ListClasseComponent } from './classe/list-classe/list-classe.component';
import { AddClasseComponent } from './classe/add-classe/add-classe.component';
import { AddFiliereComponent } from './filiere/add-filiere/add-filiere.component';
import { EditFiliereComponent } from './filiere/edit-filiere/edit-filiere.component';
import { ListMatiereComponent } from './matiere/list-matiere/list-matiere.component';
import { AddMatiereComponent } from './matiere/add-matiere/add-matiere.component';
import { EditMatiereComponent } from './matiere/edit-matiere/edit-matiere.component';
import { ListFiliereComponent } from './filiere/list-filiere/list-filiere.component';
import { HistoriqueReservationComponent } from './reservation/historique-reservation/historique-reservation.component';

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

  { path: 'salles/equipements/:id_salle', component: ListEquipementComponent },
  { path: 'salles/equipements', component: AddEquipementComponent },
  { path: 'salles/equipements', component: EditEquipementComponent },

  { path: 'filieres', component:  ListFiliereComponent},
  { path: 'filieres', component:  AddFiliereComponent},
  { path: 'filieres', component:  EditFiliereComponent},

  { path: 'matieres', component: ListMatiereComponent },
  { path: 'matieres', component:  AddMatiereComponent},
  { path: 'matieres', component:  EditMatiereComponent},

  { path: 'filieres/classes/:id_filiere', component: ListClasseComponent },

  { path: 'filieres/classes', component: ListClasseComponent },
  { path: 'filieres/classes', component:  AddClasseComponent},
  { path: 'filieres/classes', component:  EditCoursComponent},

  { path: 'cours', component:  ListCoursComponent},
  { path: 'cours', component:  AddCoursComponent},
  { path: 'cours', component:  EditCoursComponent},

  { path: 'reservations', component: ListResevationComponent},
  { path: 'historique-resevations', component: HistoriqueReservationComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionPlanningRoutingModule { }
