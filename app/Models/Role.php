<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use HasFactory;

    // Nom de la table
    protected $table = 'roles';

    // Colonnes qui peuvent être remplies automatiquement
    protected $fillable = [
        'nom_role',
        'desc'
    ];
}
