<?php

namespace App\Console\Commands;

use App\Models\Reservation;
use App\Models\Notification;
use Illuminate\Console\Command;
use Carbon\Carbon;

class CancelExpiredReservations extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'reservations:cancel-expired {--hours=2 : Nombre d\'heures après la fin de réservation}';

    /**
     * The console command description.
     */
    protected $description = 'Annule automatiquement les réservations expirées';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $hours = $this->option('hours');
        $this->info("Annulation des réservations expirées depuis {$hours} heures...");

        // Calculer la date limite pour l'annulation
        $expirationTime = Carbon::now()->subHours($hours);

        // Récupérer les réservations qui sont terminées depuis X heures
        $reservations = Reservation::with(['user', 'salle'])
            ->where('statut', 'Validée')
            ->where('date_fin', '<', $expirationTime)
            ->get();

        $cancelledCount = 0;
        $errorCount = 0;

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
                $this->line("Réservation #{$reservation->id_reservation} annulée automatiquement");
            } catch (\Exception $e) {
                $errorCount++;
                $this->error("Erreur pour la réservation #{$reservation->id_reservation}: {$e->getMessage()}");
            }
        }

        $this->info("Réservations annulées: {$cancelledCount}");
        if ($errorCount > 0) {
            $this->warn("Erreurs: {$errorCount}");
        }

        return Command::SUCCESS;
    }
}

