<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        // Envoi des rappels pour les réservations dans 24h (tous les jours à 9h)
        $schedule->command('reservations:send-reminders --hours=24')
                 ->dailyAt('09:00')
                 ->name('send-reservation-reminders-24h');

        // Envoi des rappels pour les réservations dans 2h (toutes les heures)
        $schedule->command('reservations:send-reminders --hours=2')
                 ->hourly()
                 ->name('send-reservation-reminders-2h');

        // Annulation des réservations expirées (toutes les 2 heures)
        $schedule->command('reservations:cancel-expired --hours=2')
                 ->everyTwoHours()
                 ->name('cancel-expired-reservations');

        // Nettoyage des logs (tous les dimanches à 2h)
        $schedule->command('log:clear')
                 ->weeklyOn(0, '02:00')
                 ->name('clear-logs');
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}

