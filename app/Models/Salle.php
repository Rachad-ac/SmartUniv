<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Salle extends Model
{
    use HasFactory;

    protected $table = 'salles';
    protected $primaryKey = 'id_salle';
    public $timestamps = true;

    protected $fillable = [
        'nom',
        'type_salle',
        'capacite',
        'localisation',
        'etat',    // Disponible, Occupee, Maintenance
        'photo',   // chemin / url
    ];

    protected $casts = [
        'capacite' => 'integer',
    ];

    public function reservations()
    {
        return $this->hasMany(Reservation::class, 'id_salle', 'id_salle');
    }

    public function equipements()
    {
        return $this->hasMany(Equipement::class, 'id_salle', 'id_salle');
    }

    public function plannings()
    {
        return $this->hasMany(Planning::class, 'id_salle', 'id_salle');
    }
}
