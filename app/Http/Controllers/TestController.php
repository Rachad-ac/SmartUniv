<?php

namespace App\Http\Controllers;

use App\Services\ConflictDetectionService;
use App\Services\ReminderService;
use App\Models\Reservation;
use App\Models\Planning;
use Illuminate\Http\Request;
use Carbon\Carbon;

class TestController extends Controller
{
    protected $conflictService;
    protected $reminderService;

    public function __construct(ConflictDetectionService $conflictService, ReminderService $reminderService)
    {
        $this->conflictService = $conflictService;
        $this->reminderService = $reminderService;
    }

    /**
     * Teste la détection de conflits
     */
    public function testConflictDetection(Request $request)
    {
        $validated = $request->validate([
            'id_salle' => 'required|exists:salles,id_salle',
            'date_debut' => 'required|date',
            'date_fin' => 'required|date|after:date_debut',
        ]);

        $conflicts = $this->conflictService->checkAllConflicts(
            $validated['id_salle'],
            $validated['date_debut'],
            $validated['date_fin']
        );

        return response()->json([
            'success' => true,
            'message' => 'Test de détection de conflits',
            'salle_id' => $validated['id_salle'],
            'date_debut' => $validated['date_debut'],
            'date_fin' => $validated['date_fin'],
            'conflicts' => $conflicts
        ], 200);
    }

    /**
     * Teste le système de rappels
     */
    public function testReminderSystem(Request $request)
    {
        $hours = $request->input('hours', 24);
        
        $upcomingSent = $this->reminderService->sendUpcomingReminders($hours);
        $expiredCancelled = $this->reminderService->cancelExpiredReservations(2);
        $pendingSent = $this->reminderService->sendPendingReminders(48);

        return response()->json([
            'success' => true,
            'message' => 'Test du système de rappels',
            'results' => [
                'upcoming_reminders_sent' => $upcomingSent,
                'expired_reservations_cancelled' => $expiredCancelled,
                'pending_reminders_sent' => $pendingSent
            ]
        ], 200);
    }

    /**
     * Affiche les statistiques des conflits
     */
    public function getConflictStats()
    {
        $totalReservations = Reservation::count();
        $validReservations = Reservation::where('statut', 'Validée')->count();
        $pendingReservations = Reservation::where('statut', 'En attente')->count();
        $cancelledReservations = Reservation::where('statut', 'Annulée')->count();

        $planningCount = Planning::count();
        $upcomingReservations = Reservation::where('statut', 'Validée')
            ->where('date_debut', '>', Carbon::now())
            ->count();

        return response()->json([
            'success' => true,
            'message' => 'Statistiques des conflits',
            'stats' => [
                'total_reservations' => $totalReservations,
                'valid_reservations' => $validReservations,
                'pending_reservations' => $pendingReservations,
                'cancelled_reservations' => $cancelledReservations,
                'planning_entries' => $planningCount,
                'upcoming_reservations' => $upcomingReservations
            ]
        ], 200);
    }
}

