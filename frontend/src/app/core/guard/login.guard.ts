import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      // L'utilisateur est connecté → redirection vers sa page selon le rôle
      const user = this.authService.getUser();

      if (user.role === 'Admin') {
        this.router.navigate(['/admin/gestion-admin']);
      } else if (['Etudiant', 'Enseignant'].includes(user.role)) {
        this.router.navigate(['/users/gestion-reservation']);
      } else {
        this.router.navigate(['/']); // page par défaut
      }

      return false; // Bloque l'accès à login
    }

    // L'utilisateur n'est pas connecté → peut accéder à login
    return true;
  }
}
