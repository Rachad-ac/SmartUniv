<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Filiere extends Model
{
    use HasFactory;

    protected $table = 'filieres';
    protected $primaryKey = 'id_filiere';
    protected $fillable = ['nom', 'code', 'description'];

    /**
     * Une filière possède plusieurs cours
     */
    public function cours()
    {
        return $this->hasMany(Cours::class, 'id_filiere', 'id_filiere');
    }

    /**
     * Une filière possède plusieurs classes
     */
    public function classes()
    {
        return $this->hasMany(Classe::class, 'id_filiere', 'id_filiere');
    }

    /**
     * Une filière est suivie par plusieurs utilisateurs (étudiants)
     * Ici, on suppose que le modèle "User" regroupe enseignants et étudiants
     */
    public function etudiants()
    {
        return $this->belongsToMany(User::class, 'user_filiere', 'id_filiere', 'id_user')
                    ->withTimestamps();
    }

    /**
     * Une filière peut avoir plusieurs réservations associées
     */
    public function reservations()
    {
        return $this->hasMany(Reservation::class, 'id_filiere', 'id_filiere');
    }
}
