<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Classe extends Model
{
    use HasFactory;

    protected $table = 'classes';
    protected $primaryKey = 'id_classe';
    public $timestamps = true;

    protected $fillable = [
        'nom',
        'niveau',
        'effectif',
        'id_filiere',
    ];

    public function filiere()
    {
        return $this->belongsTo(Filiere::class, 'id_filiere', 'id_filiere');
    }

    // étudiants de la classe (pivot user_classe)
    public function etudiants()
    {
        return $this->belongsToMany(User::class, 'user_classe', 'id_classe', 'id_user')
                    ->withTimestamps();
    }

    // réservations associées (si tu stockes id_classe dans reservation)
    public function reservations()
    {
        return $this->hasMany(Reservation::class, 'id_classe', 'id_classe');
    }

    public function plannings()
    {
        return $this->hasMany(Planning::class, 'id_classe', 'id_classe');
    }
}
