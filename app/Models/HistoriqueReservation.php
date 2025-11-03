<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HistoriqueReservation extends Model
{
    use HasFactory;

    protected $table = 'historique_reservations';
    protected $primaryKey = 'id';
    public $timestamps = true;

    protected $fillable = [
        'reservation_id',
        'utilisateur_id',
        'action',
        'details',    // optionnel : JSON / texte décrivant la modification
        'date_action'
    ];

    protected $casts = [
        'date_action' => 'datetime',
    ];

    public function reservation()
    {
        return $this->belongsTo(Reservation::class, 'reservation_id', 'id_reservation');
    }

    public function utilisateur()
    {
        return $this->belongsTo(User::class, 'utilisateur_id', 'id');
    }
}
