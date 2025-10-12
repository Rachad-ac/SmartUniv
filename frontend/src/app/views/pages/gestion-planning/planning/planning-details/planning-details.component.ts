import { Component, ElementRef, OnInit, TemplateRef, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlanningService } from 'src/app/services/planning/planning.service';
import { CalendarOptions, EventInput, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { Alertes } from 'src/app/util/alerte';

@Component({
  selector: 'app-planning-details',
  templateUrl: './planning-details.component.html',
  styleUrls: ['./planning-details.component.scss']
})
export class PlanningDetailsComponent implements OnInit {

  @ViewChild('calendarEl', { read: ElementRef }) calendarEl!: ElementRef;
  @ViewChild('fullcalendar', { static: false }) fullcalendar!: FullCalendarComponent;

  calendarOptions: CalendarOptions = {};
  loading = false;
  error: string | null = null;
  classeId: number | null = null;
  filiereId: number | null = null;

  planningToUpdate: any;
  pageOptions: any = { page: 0, size: 10 };
  dataSource: any;
  loadingIndicator = true;

  // Propriétés pour le menu contextuel
  showEventMenu = false;
  selectedEvent: any = null;
  menuPosition = { x: 0, y: 0 };
  currentEventElement: HTMLElement | null = null;

  // Propriétés pour stocker les noms de la Classe et de la Filière
  classeNom: string = 'Chargement...';
  filiereNom: string = 'Chargement...';

  constructor(
    private route: ActivatedRoute, 
    private planningService: PlanningService, 
    private modalService: NgbModal
  ) {}

  // Écouter les clics en dehors du menu pour le fermer
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.showEventMenu && !this.isClickInsideMenu(event)) {
      this.closeEventMenu();
    }
  }

  // Vérifier si le clic est à l'intérieur du menu
  private isClickInsideMenu(event: MouseEvent): boolean {
    const menuElement = document.querySelector('.event-context-menu');
    return menuElement ? menuElement.contains(event.target as Node) : false;
  }

  ngOnInit(): void {
    this.filiereId = parseInt(this.route.snapshot.paramMap.get('id_filiere') || '0', 10);
    this.classeId = parseInt(this.route.snapshot.paramMap.get('id_classe') || '0', 10);
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
      headerToolbar: { 
        left: 'prev,next today', 
        center: 'title', 
        right: 'dayGridMonth,timeGridWeek,timeGridDay' 
      },
      // DÉSACTIVER le drag & drop et redimensionnement
      editable: false,
      selectable: false,
      droppable: false,
      eventDurationEditable: false,
      eventStartEditable: false,
      dayMaxEvents: true,
      eventColor: '#3788d8',
      eventTextColor: '#ffffff',
      eventBorderColor: '#2c5aa0',
      
      // Gestion des événements - SEULEMENT le clic
      eventClick: this.handleEventClick.bind(this),
      
      selectMirror: false,
      allDaySlot: false
    };
  }

  // Gestion du clic sur un événement
  handleEventClick(clickInfo: EventClickArg) {
    // Fermer le menu précédent s'il existe
    this.closeEventMenu();
    
    this.selectedEvent = clickInfo.event;
    this.currentEventElement = clickInfo.el;
    
    // Calculer la position du menu
    const rect = clickInfo.el.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    
    this.menuPosition = {
      x: rect.left + scrollLeft,
      y: rect.bottom + scrollTop + 5
    };
    
    this.showEventMenu = true;
    
    // Empêcher la propagation pour éviter la fermeture immédiate
    clickInfo.jsEvent.stopPropagation();
  }

  // Fermer le menu contextuel
  closeEventMenu() {
    this.showEventMenu = false;
    this.selectedEvent = null;
    this.currentEventElement = null;
  }

  // Supprimer un événement - VERSION CORRIGÉE
  deleteEvent() {
    if (!this.selectedEvent || !this.selectedEvent.id) {
      console.warn('Aucun événement sélectionné pour la suppression');
      return;
    }

    // Sauvegarder les références avant la confirmation
    const eventId = this.selectedEvent.id;
    const eventTitle = this.selectedEvent.title || 'cet événement';
    const eventToRemove = this.selectedEvent;

    Alertes.confirmAction(
      'Voulez-vous supprimer ?',
      `Le cours "${eventTitle}" sera définitivement supprimé`,
      () => {
        // Cette callback est exécutée seulement si l'utilisateur confirme
        console.log('✅ Suppression confirmée pour l\'événement:', eventId);
        
        const numericId = parseInt(eventId, 10);
        
        this.planningService.deletePlanning(numericId).subscribe({
          next: (response) => {
            console.log('✅ Événement supprimé:', response);
            
            // Supprimer l'événement du calendrier
            if (eventToRemove && typeof eventToRemove.remove === 'function') {
              eventToRemove.remove();
            }
            
            this.closeEventMenu();
          },
          error: (error) => {
            console.error('❌ Erreur suppression:', error);
            
            let errorMessage = 'Erreur lors de la suppression de l\'événement';
            if (error?.error?.message) {
              errorMessage += `: ${error.error.message}`;
            }
            
            alert(errorMessage);
            this.closeEventMenu();
          }
        });
      }
    );
    
    // NE PAS appeler closeEventMenu() ici
  }

  // Ouvrir la modal d'édition - VERSION CORRIGÉE
  openEditModal(content: TemplateRef<any>) {
    if (!this.selectedEvent) {
      console.warn('Aucun événement sélectionné pour l\'édition');
      return;
    }

    console.log('📝 Données de l\'événement sélectionné:', this.selectedEvent);
    console.log('📝 ExtendedProps:', this.selectedEvent.extendedProps);

    // Préparer les données pour l'édition avec TOUTES les informations
    this.planningToUpdate = {
      id: parseInt(this.selectedEvent.id, 10),
      title: this.selectedEvent.title,
      start: this.selectedEvent.start,
      end: this.selectedEvent.end,
      // Inclure toutes les propriétés étendues
      extendedProps: {
        ...this.selectedEvent.extendedProps,
        // Assurer la présence des champs essentiels
        id_planning: this.selectedEvent.extendedProps?.id_planning || parseInt(this.selectedEvent.id, 10),
        id_cours: this.selectedEvent.extendedProps?.id_cours,
        id_salle: this.selectedEvent.extendedProps?.id_salle,
        id_classe: this.selectedEvent.extendedProps?.id_classe,
        id_user: this.selectedEvent.extendedProps?.id_user,
        description: this.selectedEvent.extendedProps?.description,
        cours_nom: this.selectedEvent.extendedProps?.cours_nom,
        salle_nom: this.selectedEvent.extendedProps?.salle_nom,
        classe_nom: this.selectedEvent.extendedProps?.classe_nom,
        filiere_nom: this.selectedEvent.extendedProps?.filiere_nom,
        enseignant_nom: this.selectedEvent.extendedProps?.enseignant_nom
      }
    };

    console.log('🚀 Données envoyées au modal d\'édition:', this.planningToUpdate);

    this.openModal(content, 'lg');
    this.closeEventMenu();
  }

  private loadEvents(): void {
    const isClasseIdValid = this.classeId && !isNaN(this.classeId) && this.classeId > 0;
    const isFiliereIdValid = this.filiereId && !isNaN(this.filiereId) && this.filiereId > 0;

    if (!isClasseIdValid || !isFiliereIdValid) {
        let missingIds: string[] = [];
        if (!isClasseIdValid) missingIds.push('ID Classe');
        if (!isFiliereIdValid) missingIds.push('ID Filière');
        
        this.error = `Erreur de routage : Les ID(s) manquant(s) ou invalide(s) sont : ${missingIds.join(' et ')}. Vérifiez la définition de la route Angular.`;
        this.classeNom = 'Inconnu';
        this.filiereNom = 'Inconnu';
        this.loading = false;
        return;
    }

    this.loading = true;
    this.error = null;
    this.loadPlanning();
  }

  loadPlanning(): any {
    this.planningService.getPlanningByFiliereAndClasse(this.filiereId!, this.classeId!).subscribe({ 
      next: (response: any) => {
        const list = (response?.data || response) as any[];
        
        this.calendarOptions = { ...this.calendarOptions, events: this.adaptEvents(list) };
        this.loading = false;

        if (list.length > 0) {
            this.classeNom = list[0].extendedProps?.classe_nom || `Classe ID ${this.classeId}`;
            this.filiereNom = list[0].extendedProps?.filiere_nom || `Filière ID ${this.filiereId}`;
        } else {
            this.classeNom = `Classe ID ${this.classeId} (Aucun planning)`;
            this.filiereNom = `Filière ID ${this.filiereId}`;
        }
      },
      error: (err: any) => {
        this.error = err?.error?.message || 'Erreur de chargement du planning filtré.';
        this.calendarOptions = { ...this.calendarOptions, events: [] };
        this.loading = false;
        this.classeNom = 'Erreur';
        this.filiereNom = 'Erreur';
      }
    });
  }

  openAddPlanning(content: TemplateRef<any>): void {
    this.openModal(content, 'lg');
  }

  openModal(content: TemplateRef<any>, size: 'sm' | 'lg' | 'xl'): void {
    this.modalService.open(content, { size, backdrop: 'static' }).result.then(
      () => {
        // Action après fermeture du modal
        console.log('Modal fermé');
      },
      () => {
        // Action en cas de dismiss
        console.log('Modal dismiss');
      }
    );
  }

  close(): void {
    this.modalService.dismissAll();
    this.loadEvents(); // Recharger les événements après modification
  }

  doSearch(data: any): void {
    this.pageOptions = {
      ...data,
      page: 0,
      size: 20
    };
    this.modalService.dismissAll();
    this.loadEvents();
  }
 //Export PDF  
 
 async exportPdf() {     
  try {       
    const calendarElem = this.calendarEl?.nativeElement as HTMLElement;       
    if (!calendarElem) {         
      alert('Impossible de trouver le calendrier pour l\'export');         
      return;       
    }              
    const canvas = await html2canvas(calendarElem, { scale: 2 });       
    const imgData = canvas.toDataURL('image/png');       
    const pdf = new jsPDF('landscape', 'pt', 'a4');       
    const imgProps = (pdf as any).getImageProperties(imgData);       
    const pdfWidth = pdf.internal.pageSize.getWidth();       
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;              
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);       
    pdf.save(`planning-f${this.filiereId}-c${this.classeId}.pdf`);     
  } catch (e) {       
    console.error(e);       
    alert('Erreur lors de la génération du PDF');     
  }   
}

  private adaptEvents(plannings: any[]): EventInput[] {
    return plannings.map(p => ({
        id: String(p.id ?? p.id_planning),
        title: p.title || 'Événement sans titre',
        start: p.start, 
        end: p.end,     
        backgroundColor: p.color || '#3788d8', 
        textColor: '#ffffff',
        borderColor: '#2c5aa0',
        extendedProps: {
          ...p.extendedProps,
          // Assurer que tous les champs essentiels sont présents
          id_planning: p.id_planning || p.id,
          id_cours: p.extendedProps?.id_cours,
          id_salle: p.extendedProps?.id_salle,
          id_classe: p.extendedProps?.id_classe,
          id_user: p.extendedProps?.id_user,
          description: p.extendedProps?.description,
          cours_nom: p.extendedProps?.cours_nom,
          salle_nom: p.extendedProps?.salle_nom,
          classe_nom: p.extendedProps?.classe_nom,
          filiere_nom: p.extendedProps?.filiere_nom,
          enseignant_nom: p.extendedProps?.enseignant_nom
        }
    }));
  }
}