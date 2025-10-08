import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit{

  currentUser: any = null;

  constructor(
    @Inject(DOCUMENT) private document: Document, 
    private renderer: Renderer2,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  loadCurrentUser(): void {
    const user = this.authService.getUser();
    if (user) {
      this.currentUser = user;
    }
  }

  toggleSidebar(e: Event) {
    e.preventDefault();
    this.document.body.classList.toggle('sidebar-open');
  }

  onLogout(e: Event) {
    e.preventDefault();

    this.authService.logout().subscribe({
      next: res => console.log(res.message),
      error: err => console.error('Erreur lors de la déconnexion', err)
    });
  }

  getInitials(prenom: string, nom: string): string {
    if (!prenom || !nom) return 'U';
    return (prenom.charAt(0) + nom.charAt(0)).toUpperCase();
  }
}
