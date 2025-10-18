import { MenuItem } from './menu.model';

// Définition du menu latéral de l'application
export const MENU: MenuItem[] = [
  // Section gestion admin
  {
    label: 'Gestion Admin',
    isTitle: true,
    roles: ['Admin']
  },
  {
    label: 'Dashboard',
    icon: 'grid', 
    link: '/admin/gestion-admin/dashboard',
    roles: ['Admin']
  },
  {
    label: 'Utilisateurs',
    icon: 'user', 
    link: '/admin/gestion-admin/users',
    roles: ['Admin']
  },
  {
    label: 'Roles',
    icon: 'shield', 
    link: '/admin/gestion-admin/roles',
    roles: ['Admin']
  },

  // gestion planning
  {
    label: 'Gestion Planning',
    isTitle: true,
    roles: ['Admin']
  },
  {
    label: 'Filières',
    icon: 'git-branch', 
    link: '/admin/gestion-planning/filieres',
    roles: ['Admin']
  },
  {
    label: 'Matières',
    icon: 'book-open', 
    link: '/admin/gestion-planning/matieres',
    roles: ['Admin']
  },
  {
    label: 'Salles',
    icon: 'home', 
    link: '/admin/gestion-planning/salles',
    roles: ['Admin']
  },
  {
    label: 'Equipements',
    icon: 'cpu', 
    link: '/admin/gestion-planning/equipements',
    roles: ['Admin']
  },
  {
    label: 'Classes',
    icon: 'users', 
    link: '/admin/gestion-planning/classes',
    roles: ['Admin']
  },
  {
    label: 'Planning',
    icon: 'clock',
    link: '/admin/gestion-planning/planning',
    roles: ['Admin']
  },
  {
    label: 'Cours',
    icon: 'book', 
    link: '/admin/gestion-planning/cours',
    roles: ['Admin']
  },

  //section reservations admin
  {
    label: 'Gestion reservations',
    isTitle: true,
    roles: ['Admin']
  },
  {
    label: 'Réservations',
    icon: 'calendar',
    link: '/admin/gestion-planning/reservations',
    roles: ['Admin']
  },
  {
    label: 'Historique reservation',
    icon: 'bookmark', 
    link: '/admin/gestion-planning/historique-resevations',
    roles: ['Admin']
  },

  // Section gestion users
  {
    label: 'Réservations et plannings',
    isTitle: true,
    roles: ['Etudiant', 'Enseignant']
  },
  {
    label: 'Réserver une salle',
    icon: 'plus-circle',
    link: '/users/gestion-reservation/reserver-salles',
    roles: ['Etudiant', 'Enseignant']
  },
  {
    label: 'Mes Réservations',
    icon: 'check-square', 
    link: '/users/gestion-reservation/mes-reservations',
    roles: ['Etudiant', 'Enseignant']
  },
  {
    label: 'Historique reservation',
    icon: 'bookmark', 
    link: '/users/gestion-reservation/historiques',
    roles: ['Etudiant', 'Enseignant']
  },
  {
    label: 'Emploi du temps',
    icon: 'clock', 
    link: '/users/gestion-reservation/emploi-du-temps',
    roles: ['Etudiant', 'Enseignant']
  },

];
