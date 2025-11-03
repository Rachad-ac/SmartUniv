import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlanningService } from 'src/app/services/planning/planning.service';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';
import { FullCalendarComponent } from '@fullcalendar/angular';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-emploie-du-temps',
  templateUrl: './emploie-du-temps.component.html',
  styleUrls: ['./emploie-du-temps.component.scss']
})
export class EmploieDuTempsComponent implements OnInit {

  @ViewChild('calendarEl', { read: ElementRef }) calendarEl!: ElementRef;
  @ViewChild('fullcalendar', { static: false }) fullcalendar!: FullCalendarComponent;

  calendarOptions: CalendarOptions = {};
  loading = false;
  error: string | null = null;

  filiereId!: number;
  classeId!: number;
  userId!: number;
  userRole!: string; // 'enseignant' ou 'etudiant'

  filiereNom = '';
  classeNom = '';
  userNom = '';
  currentUser : any;

  constructor(
    private route: ActivatedRoute,
    private planningService: PlanningService
  ) {}

  ngOnInit(): void {

    this.initCalendar();
    this.loadPlanning();
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
      headerToolbar: { 
        left: 'prev,next today', 
        center: 'title', 
        right: 'dayGridMonth,timeGridWeek,timeGridDay' 
      },
      editable: false,
      selectable: false,
      droppable: false,
      eventDurationEditable: false,
      eventStartEditable: false,
      allDaySlot: false,
      dayMaxEvents: true,
      eventColor: '#3788d8',
      eventTextColor: '#ffffff',
      eventBorderColor: '#2c5aa0',
      events: []
    };
  }

  private loadPlanning(): void {
    this.loading = true;
    this.error = null;

    const user = localStorage.getItem('user');

    if(user){
      this.currentUser = JSON.parse(user);
    }

    if (this.currentUser.role === 'Enseignant') {
      // Charger les cours de l’enseignant
      this.planningService.getPlanningByUser(this.currentUser.id).subscribe({
        next: (response: any) => {
          const list = (response?.data || response) as any[];
          this.calendarOptions = { ...this.calendarOptions, events: this.adaptEvents(list) };
          this.loading = false;
          if (list.length > 0) {
            this.userNom = this.currentUser.nom + " "+ this.currentUser.prenom;
          }
        },
        error: (err) => {
          this.error = err?.error?.message || 'Erreur lors du chargement du planning enseignant.';
          this.loading = false;
        }
      });
    } else {
      console.log('id : ', this.currentUser); 
      // Charger les cours de la classe/filière de l’étudiant
      this.planningService.getPlanningByFiliereAndClasse(this.currentUser.filieres, this.currentUser.classes).subscribe({
        next: (response: any) => {
          const list = (response?.data || response) as any[];
          this.calendarOptions = { ...this.calendarOptions, events: this.adaptEvents(list) };
          this.loading = false;
          if (list.length > 0) {
            this.classeNom = list[0].extendedProps?.classe_nom || 'Classe';
            this.filiereNom = list[0].extendedProps?.filiere_nom || 'Filière';
          }
        },
        error: (err) => {
          this.error = err?.error?.message || 'Erreur lors du chargement du planning étudiant.';
          this.loading = false;
        }
      });
    }
  }

  private adaptEvents(plannings: any[]): EventInput[] {
    return plannings.map(p => ({
      id: String(p.id ?? p.id_planning),
      title: p.title || p.extendedProps?.cours_nom || 'Cours',
      start: p.start,
      end: p.end,
      backgroundColor: p.color || '#007bff',
      textColor: '#fff',
      borderColor: '#2c5aa0',
      extendedProps: {
        ...p.extendedProps,
        salle: p.extendedProps?.salle_nom || '',
        enseignant: p.extendedProps?.enseignant_nom || '',
        description: p.extendedProps?.description || ''
      }
    }));
  }

  // Exporter le calendrier en PDF
  async exportPdf(): Promise<void> {
    try {
      const calendarElem = this.calendarEl?.nativeElement as HTMLElement;
      if (!calendarElem) return;

      const canvas = await html2canvas(calendarElem, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape', 'pt', 'a4');
      const imgProps = (pdf as any).getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`emploi-du-temps-${this.userRole}.pdf`);
    } catch (e) {
      console.error(e);
      alert('Erreur lors de l’export PDF.');
    }
  }
}
