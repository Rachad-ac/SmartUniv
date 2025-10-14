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
  {
    label: 'Réservations',
    icon: 'calendar',
    link: '/admin/gestion-planning/reservations',
    roles: ['Admin']
  },

  // Section gestion users
  {
    label: 'Gestion Réservations',
    isTitle: true,
    roles: ['Etudiant', 'Enseignant']
  },
  {
    label: 'Réserver une salle',
    icon: 'plus-circle',
    link: '/users/gestion-reservation/reservation',
    roles: ['Etudiant', 'Enseignant']
  },
  {
    label: 'Mes Réservations',
    icon: 'check-square', 
    link: '/users/gestion-reservation/mes-reservation',
    roles: ['Etudiant', 'Enseignant']
  },
  {
    label: 'Historique reservation',
    icon: 'bookmark', 
    link: '/users/gestion-reservation/historique-reservation',
    roles: ['Etudiant', 'Enseignant']
  },
  {
    label: 'Mon planning',
    icon: 'clock', 
    link: '/users/gestion-reservation/mon-planning',
    roles: ['Etudiant', 'Enseignant']
  },
  {
    label: 'Mes cours',
    icon: 'book', 
    link: '/users/gestion-reservation/mes-cours',
    roles: ['Etudiant', 'Enseignant']
  },
];
