# 🏗️ Architecture du Système de Gestion des Conflits et Rappels

## 📊 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────┐
│                    SYSTÈME DE RÉSERVATION                       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   UTILISATEUR   │    │   ADMINISTRATEUR│    │   SYSTÈME AUTO  │
│                 │    │                 │    │                 │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          │ 1. Demande          │                      │
          │    Réservation      │                      │
          ▼                      │                      │
┌─────────────────────────────────┐                    │
│     RESERVATION CONTROLLER      │                    │
│                                 │                    │
│  ┌─────────────────────────────┐ │                    │
│  │  ConflictDetectionService   │ │                    │
│  │                             │ │                    │
│  │  ✓ Vérifier Planning       │ │                    │
│  │  ✓ Vérifier Réservations   │ │                    │
│  │  ✓ Détecter Conflits       │ │                    │
│  └─────────────────────────────┘ │                    │
│                                 │                    │
│  ┌─────────────────────────────┐ │                    │
│  │     Réponse au Conflit      │ │                    │
│  │                             │ │                    │
│  │  ❌ Conflit Détecté         │ │                    │
│  │  ✅ Réservation Créée      │ │                    │
│  └─────────────────────────────┘ │                    │
└─────────────────────────────────┘                    │
          │                      │                      │
          │ 2. Notification     │                      │
          ▼                      │                      │
┌─────────────────────────────────┐                    │
│     NOTIFICATION SYSTEM         │                    │
│                                 │                    │
│  ┌─────────────────────────────┐ │                    │
│  │     Email + Notification    │ │                    │
│  │                             │ │                    │
│  │  📧 ReservationMail         │ │                    │
│  │  🔔 Notification DB        │ │                    │
│  └─────────────────────────────┘ │                    │
└─────────────────────────────────┘                    │
                                                       │
                                                       │ 3. Tâches Programmées
                                                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                    RAPPELS AUTOMATIQUES                         │
│                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   RAPPELS 24H  │  │   RAPPELS 2H   │  │ ANNULATION AUTO │  │
│  │                 │  │                 │  │                 │  │
│  │ 📧 Email       │  │ 📧 Email       │  │ 🔄 Statut      │  │
│  │ 🔔 Notification│  │ 🔔 Notification│  │ 🔔 Notification│  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │              REMINDER SERVICE                              │ │
│  │                                                             │ │
│  │  • sendUpcomingReminders()                                 │ │
│  │  • cancelExpiredReservations()                             │ │
│  │  • sendPendingReminders()                                  │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        BASE DE DONNÉES                         │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │  PLANNINGS  │  │ RESERVATIONS│  │NOTIFICATIONS│            │
│  │             │  │             │  │             │            │
│  │ • id_salle  │  │ • id_salle  │  │ • id_user   │            │
│  │ • date_debut│  │ • date_debut│  │ • message   │            │
│  │ • date_fin  │  │ • date_fin  │  │ • type      │            │
│  │ • statut    │  │ • statut    │  │ • date_envoi│            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Flux de Détection de Conflits

```
1. UTILISATEUR fait une demande de réservation
   ↓
2. RESERVATION CONTROLLER reçoit la demande
   ↓
3. ConflictDetectionService vérifie :
   ├── Planning officiel (table plannings)
   └── Réservations validées (table reservations)
   ↓
4. Si CONFLIT détecté :
   ├── ❌ Retourne erreur avec détails du conflit
   └── 📧 Notification à l'utilisateur
   ↓
5. Si PAS DE CONFLIT :
   ├── ✅ Crée la réservation
   ├── 📧 Envoie email de confirmation
   └── 🔔 Crée notification
```

## ⏰ Flux des Rappels Automatiques

```
1. TÂCHES PROGRAMMÉES (Cron Jobs)
   ↓
2. COMMANDES ARTISAN exécutées :
   ├── reservations:send-reminders (24h avant)
   ├── reservations:send-reminders (2h avant)
   └── reservations:cancel-expired (après expiration)
   ↓
3. REMINDER SERVICE traite :
   ├── 📧 Envoie emails de rappel
   ├── 🔄 Annule réservations expirées
   └── 🔔 Crée notifications
   ↓
4. UTILISATEURS reçoivent :
   ├── 📧 Emails de rappel
   └── 🔔 Notifications dans l'application
```

## 🛡️ Points de Contrôle

### **Avant Création de Réservation**
- ✅ Vérification des conflits avec le planning
- ✅ Vérification des conflits avec les réservations
- ✅ Validation des données d'entrée

### **Après Création de Réservation**
- ✅ Envoi d'email de confirmation
- ✅ Création de notification
- ✅ Programmation des rappels

### **Maintenance Automatique**
- ✅ Annulation des réservations expirées
- ✅ Rappels pour réservations en attente
- ✅ Nettoyage des données obsolètes

## 📊 Métriques et Monitoring

### **Statistiques Disponibles**
- Nombre total de réservations
- Réservations validées/en attente/annulées
- Conflits détectés par type
- Rappels envoyés par période
- Taux d'annulation automatique

### **Logs et Debugging**
- Logs des conflits détectés
- Logs des rappels envoyés
- Logs des annulations automatiques
- Statistiques de performance

## 🔧 Configuration Requise

### **Variables d'Environnement**
```env
MAIL_MAILER=smtp
MAIL_HOST=your-smtp-host
MAIL_PORT=587
MAIL_USERNAME=your-email
MAIL_PASSWORD=your-password
MAIL_ENCRYPTION=tls
```

### **Tâches Cron**
```bash
# Ajouter au crontab
* * * * * cd /path/to/project && php artisan schedule:run >> /dev/null 2>&1
```

### **Permissions de Fichiers**
```bash
# S'assurer que les logs sont accessibles
chmod -R 755 storage/logs
chmod -R 755 storage/framework
```

## 🚀 Déploiement

### **Étapes de Déploiement**
1. ✅ Copier les nouveaux fichiers
2. ✅ Exécuter les migrations si nécessaire
3. ✅ Configurer les tâches cron
4. ✅ Tester les fonctionnalités
5. ✅ Monitorer les logs

### **Tests de Validation**
```bash
# Tester les commandes
php artisan reservations:send-reminders --hours=24
php artisan reservations:cancel-expired --hours=2

# Tester l'API
curl -X POST http://localhost/api/reservations/check-availability \
  -H "Content-Type: application/json" \
  -d '{"id_salle":1,"date_debut":"2024-01-15 09:00:00","date_fin":"2024-01-15 11:00:00"}'
```

