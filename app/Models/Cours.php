<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Cours extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_cours';

    protected $fillable = ['nom', 'code', 'description', 'id_matiere', 'id_filiere'];

    // Un cours appartient à une matière (clé étrangère personnalisée)
    public function matiere()
    {
        return $this->belongsTo(Matiere::class, 'id_matiere', 'id_matiere');
    }

    // Un cours appartient à une filière (clé étrangère personnalisée)
    public function filiere()
    {
        return $this->belongsTo(Filiere::class, 'id_filiere', 'id_filiere');
    }

    // Un cours peut avoir plusieurs enseignants
    public function enseignants()
    {
        return $this->belongsToMany(User::class);
    }

    // Un cours peut être lié à plusieurs réservations
    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }
}
