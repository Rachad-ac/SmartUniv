# 🔍 Système de Gestion des Conflits et Rappels Automatiques

## 📋 Vue d'ensemble

Ce système implémente deux fonctionnalités majeures pour votre application de gestion des réservations :

1. **🔍 Gestion des Conflits de Réservation** - Détection automatique des conflits basée sur le planning
2. **🔔 Système de Rappels Automatiques** - Notifications et rappels programmés

---

## 🔍 **Gestion des Conflits de Réservation**

### **Principe de Fonctionnement**
Le système vérifie les conflits en comparant les nouvelles réservations avec :
- **Planning officiel** (table `plannings`)
- **Réservations validées** (table `reservations` avec statut "Validée")

### **Types de Conflits Détectés**
1. **Conflit de Planning** : La salle est déjà occupée dans le planning officiel
2. **Conflit de Réservation** : La salle est déjà réservée par un autre utilisateur

### **API Endpoints**

#### **Vérifier la Disponibilité**
```http
POST /api/reservations/check-availability
Content-Type: application/json

{
    "id_salle": 1,
    "date_debut": "2024-01-15 09:00:00",
    "date_fin": "2024-01-15 11:00:00"
}
```

**Réponse en cas de conflit :**
```json
{
    "success": false,
    "message": "Conflit de réservation détecté",
    "conflict_details": {
        "type": "planning",
        "message": "Cette salle est déjà occupée dans le planning officiel",
        "conflict_start": "2024-01-15 08:00:00",
        "conflict_end": "2024-01-15 10:00:00",
        "conflict_cours": "Mathématiques",
        "conflict_enseignant": "Dupont Jean"
    },
    "error_code": "CONFLICT_DETECTED"
}
```

#### **Créer une Réservation (avec vérification automatique)**
```http
POST /api/reservations/reserver
Content-Type: application/json

{
    "id_user": 1,
    "id_salle": 1,
    "date_debut": "2024-01-15 09:00:00",
    "date_fin": "2024-01-15 11:00:00",
    "type_reservation": "Cours",
    "description": "Cours de mathématiques"
}
```

---

## 🔔 **Système de Rappels Automatiques**

### **Types de Rappels**

#### **1. Rappels de Réservations à Venir**
- **Déclenchement** : 24h et 2h avant le début de la réservation
- **Cible** : Utilisateur ayant fait la réservation
- **Action** : Email + Notification

#### **2. Annulation Automatique des Réservations Expirées**
- **Déclenchement** : 2h après la fin de la réservation
- **Cible** : Réservations avec statut "Validée"
- **Action** : Changement de statut vers "Annulée" + Notification

#### **3. Rappels pour Réservations en Attente**
- **Déclenchement** : 48h après la création de la réservation
- **Cible** : Administrateurs
- **Action** : Notification pour traitement

### **API Endpoints**

#### **Envoi Manuel de Rappels**
```http
POST /api/reminders/send-upcoming
Content-Type: application/json

{
    "hours": 24
}
```

#### **Annulation des Réservations Expirées**
```http
POST /api/reminders/cancel-expired
Content-Type: application/json

{
    "hours": 2
}
```

#### **Exécution de Tous les Rappels**
```http
POST /api/reminders/run-all
Content-Type: application/json

{
    "upcoming_hours": 24,
    "expired_hours": 2,
    "pending_hours": 48
}
```

---

## ⚙️ **Configuration et Planification**

### **Tâches Programmées (Cron Jobs)**

Le système utilise Laravel Scheduler pour automatiser les rappels :

```php
// Dans app/Console/Kernel.php
$schedule->command('reservations:send-reminders --hours=24')
         ->dailyAt('09:00');

$schedule->command('reservations:send-reminders --hours=2')
         ->hourly();

$schedule->command('reservations:cancel-expired --hours=2')
         ->everyTwoHours();
```

### **Commandes Artisan**

```bash
# Envoyer les rappels pour les réservations dans 24h
php artisan reservations:send-reminders --hours=24

# Annuler les réservations expirées depuis 2h
php artisan reservations:cancel-expired --hours=2

# Exécuter toutes les tâches de rappel
php artisan schedule:run
```

---

## 🧪 **Tests et Débogage**

### **Endpoints de Test**

#### **Tester la Détection de Conflits**
```http
POST /api/test/conflict-detection
Content-Type: application/json

{
    "id_salle": 1,
    "date_debut": "2024-01-15 09:00:00",
    "date_fin": "2024-01-15 11:00:00"
}
```

#### **Tester le Système de Rappels**
```http
POST /api/test/reminder-system
Content-Type: application/json

{
    "hours": 24
}
```

#### **Statistiques des Conflits**
```http
GET /api/test/conflict-stats
```

---

## 📧 **Templates d'Emails**

### **Email de Rappel de Réservation**
- **Fichier** : `resources/views/emails/reservation-reminder.blade.php`
- **Classe** : `App\Mail\ReservationReminderMail`
- **Contenu** : Détails de la réservation, heure de début, salle, etc.

---

## 🔧 **Services Utilisés**

### **ConflictDetectionService**
- `checkPlanningConflict()` - Vérifie les conflits avec le planning
- `checkReservationConflict()` - Vérifie les conflits avec les réservations
- `checkAllConflicts()` - Vérifie tous les types de conflits
- `isSalleAvailable()` - Vérifie la disponibilité d'une salle

### **ReminderService**
- `sendUpcomingReminders()` - Envoie les rappels pour les réservations à venir
- `cancelExpiredReservations()` - Annule les réservations expirées
- `sendPendingReminders()` - Envoie les rappels pour les réservations en attente

---

## 🚀 **Utilisation Pratique**

### **1. Vérifier la Disponibilité Avant Réservation**
```javascript
// Frontend - Vérification avant soumission
const checkAvailability = async (salleId, dateDebut, dateFin) => {
    const response = await fetch('/api/reservations/check-availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_salle: salleId, date_debut: dateDebut, date_fin: dateFin })
    });
    
    const data = await response.json();
    return data.available;
};
```

### **2. Gérer les Conflits dans l'Interface**
```javascript
// Gestion des erreurs de conflit
if (response.error_code === 'CONFLICT_DETECTED') {
    const conflict = response.conflict_details;
    alert(`Conflit détecté : ${conflict.message}`);
    // Afficher les détails du conflit à l'utilisateur
}
```

### **3. Programmer les Rappels**
```bash
# Ajouter au crontab pour automatiser
* * * * * cd /path/to/project && php artisan schedule:run >> /dev/null 2>&1
```

---

## 📊 **Avantages du Système**

### **Pour les Utilisateurs**
- ✅ **Prévention des conflits** avant la soumission
- ✅ **Rappels automatiques** pour ne pas oublier
- ✅ **Notifications en temps réel**

### **Pour les Administrateurs**
- ✅ **Gestion automatique** des réservations expirées
- ✅ **Alertes** pour les réservations en attente
- ✅ **Statistiques** et monitoring

### **Pour le Système**
- ✅ **Intégrité des données** garantie
- ✅ **Performance optimisée** avec des requêtes efficaces
- ✅ **Maintenance automatique** des données

---

## 🔍 **Points d'Attention**

1. **Performance** : Les vérifications de conflits peuvent être coûteuses sur de grandes bases de données
2. **Précision** : Les créneaux horaires doivent être exacts (pas de chevauchement)
3. **Notifications** : S'assurer que les emails sont bien configurés
4. **Planification** : Vérifier que les tâches cron sont bien exécutées

---

## 🎯 **Prochaines Améliorations Possibles**

1. **Cache** : Mettre en cache les vérifications de disponibilité
2. **Notifications Push** : Ajouter les notifications push en plus des emails
3. **Rappels Personnalisés** : Permettre aux utilisateurs de configurer leurs rappels
4. **Analytics** : Ajouter des statistiques sur les conflits et les annulations
5. **API Webhooks** : Notifications en temps réel vers des services externes

