import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  stats: any = {};
  latestUsers: any[] = [];
  currentUser: any;

  constructor(private dashboardService: DashboardService) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    this.loadStats();
    this.loadLatestUsers();
  }

  loadStats() {
    this.dashboardService.getStats().subscribe({
      next: res => {
        this.stats = res;
        this.initCharts();
      },
      error: err => console.error('Erreur de chargement des stats', err)
    });
  }

  loadLatestUsers() {
  this.dashboardService.getLatestUsers().subscribe({
    next: res => this.latestUsers = res,
    error: err => console.error('Erreur chargement derniers inscrits', err)
  });
}

  initCharts() {
    // Diagramme circulaire des utilisateurs
    new Chart('usersChart', {
      type: 'doughnut',
      data: {
        labels: ['Admins', 'Etudiants', 'Enseignants' , 'Chef filiere' , 'Assistante'],
        datasets: [{
          data: [this.stats.admins, this.stats.etudiants, this.stats.enseignants , this.stats.chef_filiere , this.stats.assistante],
          backgroundColor: [
            '#0d6efd', // Admin (Bleu - Primary)
            '#198754', // Etudiant (Vert - Success)
            '#ffc107', // Enseignant (Jaune - Warning)
            '#dc3545', // Chef de filière (Rouge - Danger/nouveau)
            '#6c757d'  // Assistante (Gris - Secondary/nouveau)
        ],
        }]
      }
    });

    // Diagramme barre des réservations par salle
    new Chart('reservationsChart', {
      type: 'bar',
      data: {
        labels: this.stats.sallesNames,
        datasets: [{
          label: 'Réservations',
          data: this.stats.reservationsPerSalle,
          backgroundColor: '#0d6efd'
        }]
      },
      options: { scales: { y: { beginAtZero: true } } }
    });
  }
}
