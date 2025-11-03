import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SalleService } from 'src/app/services/salle/salle.service';
import { Alertes } from 'src/app/util/alerte';

@Component({
  selector: 'app-reserver-salle',
  templateUrl: './reserver-salle.component.html',
  styleUrls: ['./reserver-salle.component.scss']
})
export class ReserverSalleComponent {

   // Les colonnes affichées dans le tableau (basées sur les champs fillable du modèle Salle)
   displayedColumns: string[] = [
    'nom',
    'description'
  ];

  dataSource : any;

  constructor(
    private modalService: NgbModal,
    private salleService: SalleService,
    private router : Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getAllSalles();
  }


  /**
   * Charge toutes les salles
   */
  getAllSalles(): void {
    this.salleService.getSalles().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.dataSource = response.data || [];
        } else {
          this.dataSource = { payload: [], metadata: { totalElements: 0 } };
          Alertes.alerteAddDanger(response.message || 'Erreur lors du chargement des salles');
        }
      },
      error: err => {
        console.error('Erreur lors du chargement des salles', err);
        Alertes.alerteAddDanger('Erreur lors du chargement des salles');
      }
    });
  }

  consulterSalle(id: number) {

    if (!id) {

      console.error('⚠️ ID non défini');
      return;
    }

    this.router.navigate(['users/gestion-reservation/reserver-salles/details', id]);
  }
  

}
