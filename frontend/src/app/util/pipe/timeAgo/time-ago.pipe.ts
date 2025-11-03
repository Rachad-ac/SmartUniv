// time-ago.pipe.ts

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
  // Définir à true si vous voulez que le pipe se recalcule
  // automatiquement lorsque le temps passe (Attention aux performances)
  // Ou utiliser un service pour rafraîchir manuellement si nécessaire.
  // pure: false 
})
export class TimeAgoPipe implements PipeTransform {

  transform(value: string | Date): string {
    if (!value) return '';

    const date = new Date(value);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    // Si la date est future (problème), afficher la date complète
    if (seconds < 0) {
        return date.toLocaleDateString(); 
    }

    // Définir les intervalles de temps
    const intervals: { [key: string]: number } = {
      'an': 31536000,
      'mois': 2592000,
      'jour': 86400,
      'heure': 3600,
      'minute': 60,
      'seconde': 1
    };

    for (const key in intervals) {
      const interval = intervals[key];
      const count = Math.floor(seconds / interval);
      
      if (count >= 1) {
        // Gérer le pluriel
        const suffix = (count > 1 && key !== 'mois') ? 's' : '';
        return `il y a ${count} ${key}${suffix}`;
      }
    }
    
    return 'à l\'instant';
  }
}