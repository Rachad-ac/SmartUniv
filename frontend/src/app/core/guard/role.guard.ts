import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

 canActivate(route: ActivatedRouteSnapshot): boolean {
  const expectedRole = route.data['expectedRole'];
  const user = this.authService.getUser();

  if (!this.authService.isAuthenticated()) {
    this.router.navigate(['/login']);
    return false;
  }

  // Vérifie si l'utilisateur a le bon rôle
  if (Array.isArray(expectedRole)) {
    const hasAccess = expectedRole.some(role => this.authService.hasRole(role));
    if (!hasAccess) {
      this.router.navigate(['/unauthorized']);
      return false;
    }
  } else if (!this.authService.hasRole(expectedRole)) {
    this.router.navigate(['/unauthorized']);
    return false;
  }

  return true;
}

}
