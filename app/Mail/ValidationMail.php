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
        $subject = $this->decision === 'validée' 
            ? 'Votre réservation a été validée' 
            : 'Votre réservation a été refusée';

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
