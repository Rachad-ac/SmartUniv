import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PlanningService } from 'src/app/services/planning/planning.service';
import { Alertes } from 'src/app/util/alerte';


@Component({
	selector: 'app-list-planning',
	templateUrl: './list-planning.component.html',
	styleUrls: ['./list-planning.component.scss']
})
export class ListPlanningComponent implements OnInit {
	displayedColumns: string[] = [
		'classe',
		'filiere',
		'actions'
	];

	planningToUpdate: any;
	pageOptions: any = { page: 0, size: 10 };
	dataSource: any;
	loadingIndicator = true;

	constructor(
		private modalService: NgbModal,
		private planningService: PlanningService
	) { }

	ngOnInit(): void {
		this.getAllPlannings();
	}

	getAllPlannings(): void {
		this.planningService.getPlannings().subscribe({
			next: (response: any) => {
				//const payload = (response && (response.payload || response.data)) ?? (Array.isArray(response) ? response : []);
				this.dataSource = {
            payload: response.data, // Le tableau des plannings
            metadata: { totalElements: response.data.length, size: response.data.length } // Ajout d'une metadata basique si la pagination est manquante
        };
				this.loadingIndicator = false;
        console.log('planning : ',response);
			},
			error: err => {
				console.error(err);
				this.loadingIndicator = false;
			},
			complete: () => {
				this.loadingIndicator = false;
			}
		});
	}

	paginate($event: number): void {
		this.loadingIndicator = true;
		this.pageOptions.page = $event - 1;
		this.getAllPlannings();
	}

	openAddPlanning(content: TemplateRef<any>): void {
		this.openModal(content, 'lg');
	}

	openEditPlanning(content: TemplateRef<any>, planning: any): void {
		this.planningToUpdate = planning;
		this.openModal(content, 'lg');
	}

	openInfosPlanning(content: TemplateRef<any>, planning: any): void {
		this.planningToUpdate = planning;
		this.openModal(content, 'xl');
	}

	openModal(content: TemplateRef<any>, size: 'sm' | 'lg' | 'xl'): void {
		this.modalService.open(content, { size, backdrop: 'static' }).result.then(
			() => {},
			() => {}
		);
	}

	deletePlanning(planning: any): void {
		Alertes.confirmAction(
			'Voulez-vous supprimer ?',
			'Cet élément sera définitivement supprimé',
			() => {
				this.planningService.deletePlanning(planning.id).subscribe({
					next: () => {
						Alertes.alerteAddSuccess('Suppression réussie');
					},
					error: (err) => {
						Alertes.alerteAddDanger(err?.error?.message || 'Erreur de suppression');
					},
					complete: () => {
						this.getAllPlannings();
					}
				});
			}
		);
	}

	close(): void {
		this.modalService.dismissAll();
		this.getAllPlannings();
	}

	doSearch(data: any): void {
		this.pageOptions = {
			...data,
			page: 0,
			size: 20
		};
		this.getAllPlannings();
		this.modalService.dismissAll();
	}
}
