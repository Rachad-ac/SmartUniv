<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Classe extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_classe';

    protected $fillable = [
        'nom',
        'id_filiere',
        'niveau',
    ];

    // Relation avec Filière
    public function filiere()
    {
        return $this->belongsTo(Filiere::class, 'id_filiere');
    }

    // Une classe peut avoir plusieurs étudiants (si tu ajoutes l'entité Etudiant)
    public function user()
    {
        return $this->hasMany(User::class, 'id_classe');
    }

        // Relation Many-to-Many avec Filiere
        public function filieres()
        {
            return $this->belongsToMany(Filiere::class, 'classe_filiere', 'id_classe', 'id_filiere');
        }
}
