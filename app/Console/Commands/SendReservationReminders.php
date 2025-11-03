<?php

namespace App\Console\Commands;

use App\Models\Reservation;
use App\Models\Notification;
use App\Mail\ReservationReminderMail;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

class SendReservationReminders extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'reservations:send-reminders {--hours=24 : Nombre d\'heures avant la réservation}';

    /**
     * The console command description.
     */
    protected $description = 'Envoie des rappels automatiques pour les réservations à venir';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $hours = $this->option('hours');
        $this->info("Envoi des rappels pour les réservations dans {$hours} heures...");

        // Calculer la date limite pour les rappels
        $reminderTime = Carbon::now()->addHours($hours);

        // Récupérer les réservations validées qui commencent dans les X heures
        $reservations = Reservation::with(['user', 'salle', 'cours'])
            ->where('statut', 'Validée')
            ->where('date_debut', '>=', Carbon::now())
            ->where('date_debut', '<=', $reminderTime)
            ->get();

        $sentCount = 0;
        $errorCount = 0;

        foreach ($reservations as $reservation) {
            try {
                // Vérifier si un rappel a déjà été envoyé pour cette réservation
                $existingReminder = Notification::where('id_reservation', $reservation->id_reservation)
                    ->where('type', 'reminder')
                    ->where('date_envoi', '>=', Carbon::now()->subHours(2))
                    ->exists();

                if (!$existingReminder) {
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
                    $this->line("Rappel envoyé pour la réservation #{$reservation->id_reservation}");
                }
            } catch (\Exception $e) {
                $errorCount++;
                $this->error("Erreur pour la réservation #{$reservation->id_reservation}: {$e->getMessage()}");
            }
        }

        $this->info("Rappels envoyés: {$sentCount}");
        if ($errorCount > 0) {
            $this->warn("Erreurs: {$errorCount}");
        }

        return Command::SUCCESS;
    }
}

