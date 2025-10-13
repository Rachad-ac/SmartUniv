<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    use HasFactory;

    protected $table = 'reservations';
    protected $primaryKey = 'id_reservation';
    public $timestamps = true;

    protected $fillable = [
        'id_user',
        'id_salle',
        'id_cours',
        'id_filiere',
        'id_classe',
        'date_debut',
        'date_fin',
        'type_reservation',
        'statut',
        'motif',
        'description',
    ];

    protected $casts = [
        'date_debut' => 'datetime',
        'date_fin'   => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'id_user', 'id');
    }

    public function salle()
    {
        return $this->belongsTo(Salle::class, 'id_salle', 'id_salle');
    }

    public function cours()
    {
        return $this->belongsTo(Cours::class, 'id_cours', 'id_cours');
    }

    public function filiere()
    {
        return $this->belongsTo(Filiere::class, 'id_filiere', 'id_filiere');
    }

    public function classe()
    {
        return $this->belongsTo(Classe::class, 'id_classe', 'id_classe');
    }

    // one-to-one planning (optionnel : planning peut aussi contenir id_reservation)
    public function planning()
    {
        return $this->hasOne(Planning::class, 'id_reservation', 'id_reservation');
    }

    public function historiques()
    {
        return $this->hasMany(HistoriqueReservation::class, 'reservation_id', 'id_reservation');
    }
}
