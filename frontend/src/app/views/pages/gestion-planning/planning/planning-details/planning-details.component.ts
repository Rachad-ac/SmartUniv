import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlanningService } from 'src/app/services/planning/planning.service';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';

@Component({
  selector: 'app-planning-details',
  templateUrl: './planning-details.component.html',
  styleUrls: ['./planning-details.component.scss']
})
export class PlanningDetailsComponent implements OnInit {
  calendarOptions: CalendarOptions = {};
  loading = false;
  error: string | null = null;
  classeId: number | null = null;
  filiereId: number | null = null;

  constructor(private route: ActivatedRoute, private planningService: PlanningService) {}

  ngOnInit(): void {
    this.classeId = Number(this.route.snapshot.paramMap.get('id'));
    this.filiereId = Number(this.route.snapshot.queryParamMap.get('filiere'));
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
      slotMaxTime: '21:00:00',
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
        const filtered = list.filter(p =>
          (!this.classeId || p.id_classe === this.classeId) &&
          (!this.filiereId || p.classe?.id_filiere === this.filiereId)
        );
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

  private adaptEvents(plannings: any[]): EventInput[] {
    return plannings.map(p => ({
      id: String(p.id ?? p.id_planning),
      title: `${p.cours?.nom || p.cours?.titre || 'Cours'} | ${p.user?.nom ?? ''} | ${p.salle?.nom ?? ''}`,
      start: p.date_debut,
      end: p.date_fin,
      backgroundColor: '#3788d8',
      textColor: '#ffffff',
      borderColor: '#2c5aa0'
    }));
  }
}
