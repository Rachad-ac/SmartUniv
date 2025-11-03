import { Component, Input, OnInit } from '@angular/core';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';
import { PlanningService } from 'src/app/services/planning/planning.service';

@Component({
  selector: 'app-infos-planning',
  templateUrl: './infos-planning.component.html',
  styleUrls: ['./infos-planning.component.scss']
})
export class InfosPlanningComponent implements OnInit {

  @Input() filters: { id_filiere?: number | null; id_classe?: number | null; id_cours?: number | null } = {};

  loading = false;
  error: string | null = null;

  calendarOptions: CalendarOptions = {};

  constructor(private planningService: PlanningService) {}

  ngOnInit(): void {
    this.initCalendar();
    this.loadEvents();
  }

  private initCalendar(): void {
    this.calendarOptions = {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      initialView: 'timeGridWeek',
      locale: frLocale,
      firstDay: 1,
      hiddenDays: [0],
      slotMinTime: '08:00:00',
      slotMaxTime: '20:30:00',
      headerToolbar: { left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,timeGridDay' },
      editable: false,
      selectable: false,
      dayMaxEvents: true,
      eventColor: '#3788d8',
      eventTextColor: '#ffffff',
      eventBorderColor: '#2c5aa0',
    };
  }

  private loadEvents(): void {
    this.loading = true;
    this.error = null;

    this.planningService.getPlannings().subscribe({
      next: (response: any) => {
        const list = (response?.data || response) as any[];
        const filtered = this.applyFilters(Array.isArray(list) ? list : []);
        this.calendarOptions = { ...this.calendarOptions, events: this.adaptEvents(filtered) };
        this.loading = false;
      },
      error: (err: any) => {
        this.error = err?.error?.message || 'Erreur de chargement du planning';
        this.calendarOptions = { ...this.calendarOptions, events: [] };
        this.loading = false;
      }
    });
  }

  private applyFilters(plannings: any[]): any[] {
    const { id_filiere, id_classe, id_cours } = this.filters || {};
    return plannings.filter(p =>
      (id_filiere ? p.id_filiere === id_filiere || p.classe?.id_filiere === id_filiere : true) &&
      (id_classe ? p.id_classe === id_classe : true) &&
      (id_cours ? p.id_cours === id_cours : true)
    );
  }

  private adaptEvents(plannings: any[]): EventInput[] {
    return plannings.map(p => ({
      id: String(p.id ?? p.id_planning),
      title: `${p.cours?.nom || p.cours?.titre || 'Cours'} - ${p.salle?.nom || 'Salle'}`,
      start: p.date_debut,
      end: p.date_fin,
      backgroundColor: '#3788d8',
      textColor: '#ffffff',
      borderColor: '#2c5aa0'
    }));
  }
}
