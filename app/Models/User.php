<?php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'users';
    protected $primaryKey = 'id'; // si ta table utilise 'id' sinon ajuste
    public $timestamps = true;

    protected $fillable = [
        'nom',
        'prenom',
        'email',
        'password',
        'statut',       // ex: actif/inactif/suspendu
        'date_inscription',
        'role_id',      // FK vers roles.id
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'date_inscription' => 'datetime',
        'statut' => 'string',
    ];

    // relations
    public function role()
    {
        return $this->belongsTo(Role::class, 'role_id', 'id');
    }

    public function reservations()
    {
        return $this->hasMany(Reservation::class, 'id_user', 'id');
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class, 'id_user', 'id');
    }

    // classes (Many-to-Many student <> classe)
    public function classes()
    {
        return $this->belongsToMany(Classe::class, 'user_classe', 'id_user', 'id_classe')
                    ->withTimestamps();
    }

    // filieres (Many-to-Many)
    public function filieres()
    {
        return $this->belongsToMany(Filiere::class, 'user_filiere', 'id_user', 'id_filiere')
                    ->withTimestamps();
    }

    // si l'utilisateur est enseignant : cours qu'il enseigne (pivot table cours_user)
    public function coursEnseignes()
    {
        return $this->belongsToMany(Cours::class, 'cours_user', 'user_id', 'cours_id')
                    ->withTimestamps();
    }

    // planning créés par l'utilisateur (ex: enseignant / admin)
    public function plannings()
    {
        return $this->hasMany(Planning::class, 'id_user', 'id');
    }

    // historique actions
    public function historiques()
    {
        return $this->hasMany(HistoriqueReservation::class, 'utilisateur_id', 'id');
    }
}
