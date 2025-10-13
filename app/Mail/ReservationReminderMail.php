<?php

namespace App\Mail;

use App\Models\Reservation;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ReservationReminderMail extends Mailable
{
    use Queueable, SerializesModels;

    public $reservation;
    public $hours;

    /**
     * Create a new message instance.
     */
    public function __construct(Reservation $reservation, $hours = 24)
    {
        $this->reservation = $reservation;
        $this->hours = $hours;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        $subject = "Rappel : Réservation de salle dans {$this->hours} heures";
        
        return $this->subject($subject)
                    ->view('emails.reservation-reminder')
                    ->with([
                        'reservation' => $this->reservation,
                        'hours' => $this->hours,
                        'user' => $this->reservation->user,
                        'salle' => $this->reservation->salle,
                        'cours' => $this->reservation->cours,
                    ])
                    ->withSwiftMessage(function ($message) {
                        $message->getHeaders()->addTextHeader('X-Mailer', 'Laravel');
                    });
    }
}

