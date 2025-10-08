<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class Filiere extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_filiere';

    protected $fillable = ['nom', 'code', 'description'];

    // Une matière peut avoir plusieurs cours
    public function cours()
    {
        return $this->hasMany(Cours::class);
    }

        // Relation Many-to-Many avec Etudiant
        public function etudiants()
        {
            return $this->belongsToMany(Etudiant::class, 'etudiant_filiere', 'id_filiere', 'id_etudiant');
        }

        // Relation Many-to-Many avec Classe
        public function classes()
        {
            return $this->belongsToMany(Classe::class, 'classe_filiere', 'id_filiere', 'id_classe');
        }
}
