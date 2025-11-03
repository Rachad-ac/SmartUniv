import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanningDetailsComponent } from './planning-details.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [PlanningDetailsComponent],
  imports: [
    CommonModule,
    FullCalendarModule,
    RouterModule
  ],
  exports: [PlanningDetailsComponent]
})
export class PlanningDetailsModule {}
