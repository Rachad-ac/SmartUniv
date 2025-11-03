<?php

namespace App\Mail;

use App\Models\Reservation;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ValidationMail extends Mailable
{
    use Queueable, SerializesModels;

    public $reservation;
    public $decision;

    /**
     * Create a new message instance.
     */
    public function __construct(Reservation $reservation, string $decision)
    {
        $this->reservation = $reservation;
        $this->decision = $decision;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        // Déterminer le sujet selon la décision
        switch ($this->decision) {
            case 'Validée':
                $subject = 'Votre réservation a été validée';
                break;

            case 'Refusée':
                $subject = 'Votre réservation a été refusée';
                break;

            case 'Annulée':
                $subject = 'Votre réservation a été annulée';
                break;

            default:
                $subject = 'Mise à jour de votre réservation';
                break;
        }

        return $this->subject($subject)
                    ->view('emails.validation')
                    ->with([
                        'reservation' => $this->reservation,
                        'decision' => $this->decision,
                    ])
                    ->withSwiftMessage(function ($message) {
                        $message->getHeaders()->addTextHeader('X-Mailer', 'Laravel');
                    });
    }
}
