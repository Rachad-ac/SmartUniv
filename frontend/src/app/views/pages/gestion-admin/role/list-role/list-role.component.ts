import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Alertes } from '../../../../../util/alerte';
import { RoleService } from '../../../../../services/role/role.service';

@Component({
  selector: 'app-list-role',
  templateUrl: './list-role.component.html',
  styleUrls: ['./list-role.component.scss']
})
export class ListRoleComponent implements OnInit {

  displayedColumns: string[] = [
    'nom',
    'description',
    'actions'
  ];

  roleToUpdate: any;
  roleId: any;
  pageOptions: any = { page: 0, size: 10 };
  dataSource: any;
  role: any;
  loadingIndicator = true;

  constructor(
    private modalService: NgbModal,
    private roleService: RoleService
  ) { }

  ngOnInit(): void {
    this.getAllRoles();
    this.getRoleById();
  }

  getAllRoles(): void {
    this.roleService.getAllRoles().subscribe({
      next: (response: any) => {
        const payload = (response && (response.payload || response.data)) ?? (Array.isArray(response) ? response : []);
        this.dataSource = { payload };
        this.loadingIndicator = false;
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

  getRoleById(): void {
    this.roleId = localStorage.getItem('roleId');
    if (!this.roleId) { return; }
    this.roleService.getRoleById(this.roleId).subscribe({
      next: (data) => {
        this.role = data?.data ?? data;
      },
      error: (error) => {
        Alertes.alerteAddDanger(error?.error?.message || 'Erreur de récupération du rôle');
      }
    });
  }

  paginate($event: number): void {
    this.loadingIndicator = true;
    this.pageOptions.page = $event - 1;
    this.getAllRoles();
  }

  openAddRole(content: TemplateRef<any>): void {
    this.openModal(content, 'lg');
  }

  openEditRole(content: TemplateRef<any>, role: any): void {
    this.roleToUpdate = role;
    this.openModal(content, 'lg');
  }

  openInfoRole(content: TemplateRef<any>, role: any): void {
    this.role = role;
    this.openModal(content, 'lg');
  }

  openModal(content: TemplateRef<any>, size: 'sm' | 'lg' | 'xl'): void {
    this.modalService.open(content, { size, backdrop: 'static' }).result.then(
      () => {},
      () => {}
    );
  }

  deleteRole(role: any): void {
    Alertes.confirmAction(
      'Voulez-vous supprimer ?',
      'Cet élément sera définitivement supprimé',
      () => {
        this.roleService.deleteRole(role.id).subscribe({
          next: () => {
            Alertes.alerteAddSuccess('Suppression réussie');
          },
          error: (err) => {
            Alertes.alerteAddDanger(err?.error?.message || 'Erreur de suppression');
          },
          complete: () => {
            this.getAllRoles();
          }
        });
      }
    );
  }

  close(): void {
    this.modalService.dismissAll();
    this.getAllRoles();
    this.getRoleById();
  }

  doSearch(data: any): void {
    this.pageOptions = {
      ...data,
      page: 0,
      size: 20
    };
    this.getAllRoles();
    this.modalService.dismissAll();
  }
}
