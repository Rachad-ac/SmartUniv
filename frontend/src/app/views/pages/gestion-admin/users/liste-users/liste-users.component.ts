import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/services/user/user.service';
import { Alertes } from 'src/app/util/alerte'; // si tu utilises la même classe d'alertes

@Component({
  selector: 'app-liste-users',
  templateUrl: './liste-users.component.html',
  styleUrls: ['./liste-users.component.scss']
})
export class ListeUsersComponent implements OnInit {

  displayedColumns: string[] = [
    'nom',
    'prenom',
    'email',
    'role',
    'actions'
  ];

  userToUpdate: any;
  userId: any;
  pageOptions: any = { page: 0, size: 10 };
  dataSource: any;
  user: any;
  loadingIndicator = true;
  searchTerm: string = ''; 

  constructor(
    private modalService: NgbModal,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.getAllUsers();
    this.getUserById();
  }

  // Charger tous les utilisateurs
  getAllUsers(): void {
    this.userService.getUsers().subscribe({
      next: response => {
        this.dataSource = response;
        this.loadingIndicator = false;
      },
      error: err => {
        console.error('Erreur lors du chargement des utilisateurs', err);
        this.loadingIndicator = false;
      },
      complete: () => {
        this.loadingIndicator = false;
      }
    });
  }

  // Charger un utilisateur par ID (par ex. stocké en localStorage)
  getUserById() {
    this.userId = localStorage.getItem('userId');
    if (!this.userId) return;

    this.userService.getUserById(this.userId).subscribe({
      next: (data) => {
        this.user = data.data;
      },
      error: (error) => {
        Alertes.alerteAddDanger(error.error.message);
      }
    });
  }
  

  // Pagination
  paginate($event: number): void {
    this.loadingIndicator = true;
    this.pageOptions.page = $event - 1;
    this.getAllUsers();
  }

  // Ouvrir modal d’ajout
  openAddUser(content: TemplateRef<any>): void {
    this.openModal(content, 'lg');
  }

  // Ouvrir modal d’édition
  openEditUser(content: TemplateRef<any>, user: any): void {
    this.userToUpdate = user;
    this.openModal(content, 'lg');
  }

  // Ouvrir modal générique
  openModal(content: TemplateRef<any>, size: 'md' | 'sm' | 'lg' | 'xl'): void {
    this.modalService.open(content, { size, backdrop: 'static'}).result.then(
      () => {},
      () => {}
    );
  }

  // Suppression utilisateur
  deleteUser(user: any): void {
    Alertes.confirmAction(
      'Voulez-vous supprimer ?',
      'Cet utilisateur sera définitivement supprimé',
      () => {
        this.userService.deleteUser(user.id).subscribe({
          next: () => {
            Alertes.alerteAddSuccess('Suppression réussie');
          },
          error: (err) => {
            Alertes.alerteAddDanger(err?.error?.message || 'Erreur de suppression');
          },
          complete: () => {
            this.getAllUsers();
          }
        });
      }
    );
  }

  // Fermer modal
  close(): void {
    this.modalService.dismissAll();
    this.getAllUsers();
    this.getUserById();
  }

  doSearch(criteria: any): void {
    
    if (Object.keys(criteria).length === 0) {
        this.getAllUsers();
        return;
    }

    this.userService.SearchUsers(criteria).subscribe({
      next: (response: any) => {
        this.user = response.data;
        const count = response.count !== undefined ? response.count : response.data.length;
      },
      error: (err) => {
        console.error("Erreur de recherche par critères", err);
      }
    });
  }
}
