<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cours extends Model
{
    use HasFactory;

    protected $table = 'cours';
    protected $primaryKey = 'id_cours';
    public $timestamps = true;

    protected $fillable = [
        'nom',
        'code',
        'description',
        'id_matiere',
        'id_filiere',
        'semestre',
        'volume_horaire',
    ];

    public function matiere()
    {
        return $this->belongsTo(Matiere::class, 'id_matiere', 'id_matiere');
    }

    public function filiere()
    {
        return $this->belongsTo(Filiere::class, 'id_filiere', 'id_filiere');
    }

    public function enseignants()
    {
        // pivot table 'cours_user' (cours_id, user_id)
        return $this->belongsToMany(User::class, 'cours_user', 'cours_id', 'user_id')
                    ->withTimestamps();
    }

    public function reservations()
    {
        return $this->hasMany(Reservation::class, 'id_cours', 'id_cours');
    }

    public function plannings()
    {
        return $this->hasMany(Planning::class, 'id_cours', 'id_cours');
    }
}
