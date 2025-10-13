<?php

namespace App\Services;

use App\Models\Reservation;
use App\Models\Notification;
use App\Mail\ReservationReminderMail;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

class ReminderService
{
    /**
     * Envoie des rappels pour les réservations à venir
     */
    public function sendUpcomingReminders($hours = 24)
    {
        $reminderTime = Carbon::now()->addHours($hours);
        
        $reservations = Reservation::with(['user', 'salle', 'cours'])
            ->where('statut', 'Validée')
            ->where('date_debut', '>=', Carbon::now())
            ->where('date_debut', '<=', $reminderTime)
            ->get();

        $sentCount = 0;

        foreach ($reservations as $reservation) {
            // Vérifier si un rappel a déjà été envoyé
            $existingReminder = Notification::where('id_reservation', $reservation->id_reservation)
                ->where('type', 'reminder')
                ->where('date_envoi', '>=', Carbon::now()->subHours(2))
                ->exists();

            if (!$existingReminder) {
                try {
                    // Envoyer l'email de rappel
                    Mail::to($reservation->user->email)
                        ->send(new ReservationReminderMail($reservation, $hours));

                    // Créer une notification
                    Notification::create([
                        'message' => "Rappel : Votre réservation de la salle {$reservation->salle->nom} commence dans {$hours} heures",
                        'date_envoi' => now(),
                        'lu' => false,
                        'id_user' => $reservation->id_user,
                        'id_reservation' => $reservation->id_reservation,
                        'type' => 'reminder'
                    ]);

                    $sentCount++;
                } catch (\Exception $e) {
                    \Log::error("Erreur envoi rappel réservation #{$reservation->id_reservation}: " . $e->getMessage());
                }
            }
        }

        return $sentCount;
    }

    /**
     * Annule automatiquement les réservations expirées
     */
    public function cancelExpiredReservations($hours = 2)
    {
        $expirationTime = Carbon::now()->subHours($hours);
        
        $reservations = Reservation::with(['user', 'salle'])
            ->where('statut', 'Validée')
            ->where('date_fin', '<', $expirationTime)
            ->get();

        $cancelledCount = 0;

        foreach ($reservations as $reservation) {
            try {
                // Marquer la réservation comme annulée
                $reservation->update(['statut' => 'Annulée']);

                // Créer une notification
                Notification::create([
                    'message' => "Votre réservation de la salle {$reservation->salle->nom} a été automatiquement annulée car elle est expirée",
                    'date_envoi' => now(),
                    'lu' => false,
                    'id_user' => $reservation->id_user,
                    'id_reservation' => $reservation->id_reservation,
                    'type' => 'auto_cancellation'
                ]);

                $cancelledCount++;
            } catch (\Exception $e) {
                \Log::error("Erreur annulation réservation #{$reservation->id_reservation}: " . $e->getMessage());
            }
        }

        return $cancelledCount;
    }

    /**
     * Envoie des rappels pour les réservations en attente depuis trop longtemps
     */
    public function sendPendingReminders($hours = 48)
    {
        $reminderTime = Carbon::now()->subHours($hours);
        
        $reservations = Reservation::with(['user', 'salle'])
            ->where('statut', 'En attente')
            ->where('created_at', '<', $reminderTime)
            ->get();

        $sentCount = 0;

        foreach ($reservations as $reservation) {
            try {
                // Créer une notification pour l'admin
                Notification::create([
                    'message' => "Réservation en attente depuis {$hours}h : Salle {$reservation->salle->nom} - {$reservation->user->nom}",
                    'date_envoi' => now(),
                    'lu' => false,
                    'id_user' => 1, // Admin
                    'id_reservation' => $reservation->id_reservation,
                    'type' => 'pending_reminder'
                ]);

                $sentCount++;
            } catch (\Exception $e) {
                \Log::error("Erreur rappel réservation en attente #{$reservation->id_reservation}: " . $e->getMessage());
            }
        }

        return $sentCount;
    }
}

