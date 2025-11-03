export interface Planning {
  id: number;
  id_cours: number;
  id_salle: number;
  id_classe: number;
  id_user: number;
  date_debut: string;
  date_fin: string;
  description?: string;
  cours?: Cours;
  salle?: Salle;
  classe?: Classe;
  user?: User;
}

export interface Classe {
  id: number;
  nom: string;
  id_filiere: number;
}

export interface Cours {
  id: number;
  nom: string;
  id_matiere: number;
}

export interface Salle {
  id: number;
  nom: string;
  capacite: number;
}

export interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: string;
}
