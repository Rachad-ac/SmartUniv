import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/services/user/user.service';
import { Alertes } from 'src/app/util/alerte';

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
    'date_inscription',
    'role',
    'statut',
    'actions'
  ];

  userToUpdate: any;
  userId: any;
  pageOptions: any = { page: 0, size: 10 };
  dataSource: any;
  rows: any[] = [];
  total = 0;
  user: any;
  loadingIndicator = true;
  searchTerm: string = '';
  roles: any[] = [];

  constructor(
    private modalService: NgbModal,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.getAllUsers();
    this.getUserById();
    this.loadRoles();
  }

  /**
   * Charge tous les utilisateurs
   */
  getAllUsers(): void {
    this.loadingIndicator = true;
    this.userService.getUsers().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.dataSource = { 
            payload: response.data || [], 
            metadata: { totalElements: response.data?.length || 0 } 
          };
        } else {
          this.dataSource = { payload: [], metadata: { totalElements: 0 } };
          Alertes.alerteAddDanger(response.message || 'Erreur lors du chargement');
        }
        this.loadingIndicator = false;
      },
      error: err => {
        console.error('Erreur lors du chargement des utilisateurs', err);
        Alertes.alerteAddDanger('Erreur lors du chargement des utilisateurs');
        this.loadingIndicator = false;
      }
    });
  }

  /**
   * Charge les rôles disponibles
   */
  loadRoles(): void {
    this.userService.getRoles().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.roles = response.data.map((role: any) => ({
            value: role.id,
            label: role.nom
          }));
        }
      },
      error: (err) => {
        console.error('Erreur lors du chargement des rôles', err);
      }
    });
  }

  /**
   * Charge un utilisateur par ID
   */
  getUserById() {
    this.userId = localStorage.getItem('userId');
    if (!this.userId) return;

    this.userService.getUserById(this.userId).subscribe({
      next: (data) => {
        if (data.success) {
          this.user = data.data;
        }
      },
      error: (error) => {
        Alertes.alerteAddDanger(error.error?.message || 'Erreur lors du chargement de l\'utilisateur');
      }
    });
  }

  /**
   * Gestion de la pagination
   */
  paginate($event: number): void {
    this.loadingIndicator = true;
    this.pageOptions.page = $event - 1;
    this.getAllUsers();
  }

  /**
   * Ouvre le modal d'ajout d'utilisateur
   */
  openAddUser(content: TemplateRef<any>): void {
    this.openModal(content, 'lg');
  }

  /**
   * Ouvre le modal d'édition d'utilisateur
   */
  openEditUser(content: TemplateRef<any>, user: any): void {
    this.userToUpdate = user;
    this.openModal(content, 'lg');
  }

  /**
   * Ouvre un modal générique
   */
  openModal(content: TemplateRef<any>, size: 'md' | 'sm' | 'lg' | 'xl'): void {
    this.modalService.open(content, { size, backdrop: 'static'}).result.then(
      () => {},
      () => {}
    );
  }

  /**
   * Supprime un utilisateur
   */
  deleteUser(user: any): void {
    Alertes.confirmAction(
      'Voulez-vous supprimer cet utilisateur ?',
      `L'utilisateur ${user.nom} ${user.prenom} sera définitivement supprimé`,
      () => {
        this.userService.deleteUser(user.id).subscribe({
          next: (response: any) => {
            if (response.success) {
              Alertes.alerteAddSuccess('Utilisateur supprimé avec succès');
              this.getAllUsers();
            } else {
              Alertes.alerteAddDanger(response.message || 'Erreur lors de la suppression');
            }
          },
          error: (err) => {
            Alertes.alerteAddDanger(err?.error?.message || 'Erreur lors de la suppression');
          }
        });
      }
    );
  }

  refresh(): void {
    this.getAllUsers();
    this.getUserById();
  }

  /**
   * Ferme tous les modals
   */
  close(): void {
    this.modalService.dismissAll();
    this.getAllUsers();
    this.getUserById();
  }

  /**
   * Effectue une recherche d'utilisateurs
   */
  doSearch(criteria: any): void {
    if (Object.keys(criteria).length === 0 || this.isEmptySearch(criteria)) {
      this.getAllUsers();
      return;
    }

    this.loadingIndicator = true;
    this.userService.searchUsers(criteria).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.dataSource = { 
            payload: response.data || [], 
            metadata: { totalElements: response.data?.length || 0 } 
          };
          this.modalService.dismissAll();
        } else {
          this.dataSource = { payload: [], metadata: { totalElements: 0 } };
          Alertes.alerteAddDanger(response.message || 'Aucun résultat trouvé');
        }
        this.loadingIndicator = false;
      },
      error: (err) => {
        console.error("Erreur de recherche", err);
        Alertes.alerteAddDanger('Erreur lors de la recherche');
        this.loadingIndicator = false;
      }
    });
  }

  /**
   * Vérifie si les critères de recherche sont vides
   */
  private isEmptySearch(criteria: any): boolean {
    return Object.values(criteria).every(value => 
      value === null || value === undefined || value === ''
    );
  }

  /**
   * Obtient le nom du rôle à partir de l'ID
   */
  getRoleName(roleId: number): string {
    const role = this.roles.find(r => r.value === roleId);
    return role ? role.label : 'Non défini';
  }

  /**
   * Obtient la classe CSS pour le statut
   */
  getStatusClass(statut: string): string {
    switch (statut) {
      case 'actif': return 'text-success';
      case 'inactif': return 'text-warning';
      case 'suspendu': return 'text-danger';
      default: return 'text-secondary';
    }
  }

  /**
   * Obtient la classe CSS pour le rôle
   */
  getRoleClass(roleName: string): string {
    switch (roleName?.toLowerCase()) {
      case 'Admin': return 'text-danger fw-bold';
      case 'Enseignant': return 'text-warning fw-bold';
      case 'Etudiant': return 'text-success fw-bold';
      default: return 'text-secondary';
    }
  }
}
