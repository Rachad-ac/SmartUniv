<?php

namespace App\Http\Controllers;

use App\Services\ReminderService;
use Illuminate\Http\Request;

class ReminderController extends Controller
{
    protected $reminderService;

    public function __construct(ReminderService $reminderService)
    {
        $this->reminderService = $reminderService;
    }

    /**
     * Envoie manuellement des rappels pour les réservations à venir
     */
    public function sendUpcomingReminders(Request $request)
    {
        $hours = $request->input('hours', 24);
        
        $sentCount = $this->reminderService->sendUpcomingReminders($hours);

        return response()->json([
            'success' => true,
            'message' => "Rappels envoyés pour les réservations dans {$hours} heures",
            'sent_count' => $sentCount
        ], 200);
    }

    /**
     * Annule manuellement les réservations expirées
     */
    public function cancelExpiredReservations(Request $request)
    {
        $hours = $request->input('hours', 2);
        
        $cancelledCount = $this->reminderService->cancelExpiredReservations($hours);

        return response()->json([
            'success' => true,
            'message' => "Réservations expirées annulées",
            'cancelled_count' => $cancelledCount
        ], 200);
    }

    /**
     * Envoie des rappels pour les réservations en attente
     */
    public function sendPendingReminders(Request $request)
    {
        $hours = $request->input('hours', 48);
        
        $sentCount = $this->reminderService->sendPendingReminders($hours);

        return response()->json([
            'success' => true,
            'message' => "Rappels envoyés pour les réservations en attente depuis {$hours}h",
            'sent_count' => $sentCount
        ], 200);
    }

    /**
     * Exécute toutes les tâches de rappel
     */
    public function runAllReminders(Request $request)
    {
        $upcomingHours = $request->input('upcoming_hours', 24);
        $expiredHours = $request->input('expired_hours', 2);
        $pendingHours = $request->input('pending_hours', 48);

        $upcomingSent = $this->reminderService->sendUpcomingReminders($upcomingHours);
        $expiredCancelled = $this->reminderService->cancelExpiredReservations($expiredHours);
        $pendingSent = $this->reminderService->sendPendingReminders($pendingHours);

        return response()->json([
            'success' => true,
            'message' => 'Toutes les tâches de rappel ont été exécutées',
            'results' => [
                'upcoming_reminders_sent' => $upcomingSent,
                'expired_reservations_cancelled' => $expiredCancelled,
                'pending_reminders_sent' => $pendingSent
            ]
        ], 200);
    }
}

