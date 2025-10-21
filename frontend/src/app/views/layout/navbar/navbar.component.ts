import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { AuthService } from 'src/app/services/auth/auth.service';
import { NotificationService } from 'src/app/services/notification/notification.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit{

  currentUser: any = null;
  loading = false;
  notifs: any[] = [];

  constructor(
    @Inject(DOCUMENT) private document: Document, 
    private renderer: Renderer2,
    private authService: AuthService,
    private notifService : NotificationService
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadNotifs(this.currentUser.id);
  }

  loadCurrentUser(): void {
    const user = this.authService.getUser();
    if (user) {
      this.currentUser = user;
    }
  }

  loadNotifs(id : any) : void {
    this.loading = true;
    this.notifService.getNotifs(id).subscribe({
      next : res => {
        console.log('notifs : ', res.data);
        this.notifs = res.data || [];
        this.loading = false;
      },
      error: err => {
        console.error('Erreur lors du chargement des notifications', err);
        this.loading = false;
      },
    })
  }

  readNotifs(id : any) : any {
    this.loading = true;
    this.notifService.ReadNotifs(id).subscribe({
      next : res => {
        if(res.success) {
          this.loadNotifs(this.currentUser.id);
          console.log('notification lu')
        }
        this.loading = false;
      },
      error: err => {
        console.log('erreur lors de la lecture de la notification ', err)
        this.loading = false;
      },
    })
  }

  toggleSidebar(e: Event) {
    e.preventDefault();
    this.document.body.classList.toggle('sidebar-open');
  }

  onLogout(e: Event) {
    e.preventDefault();
  
    this.loading = true;
  
    setTimeout(() => {
      this.authService.logout().subscribe({
        next: res => {
          console.log(res.message);
          this.loading = false;
        },
        error: err => {
          console.error('Erreur lors de la déconnexion', err);
          this.loading = false;
        }
      });
    }, 300); // délai de 0,3 seconde (ajuste selon ton animation)
  }
  

  getInitials(prenom: string, nom: string): string {
    if (!prenom || !nom) return 'U';
    return (prenom.charAt(0) + nom.charAt(0)).toUpperCase();
  }
}
