<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Planning extends Model
{
    use HasFactory;

    protected $table = 'plannings';
    protected $primaryKey = 'id_planning';
    public $timestamps = true;

    protected $fillable = [
        'id_salle',
        'id_user',
        'id_cours',
        'id_classe',
        'date_debut',
        'date_fin',
        'description',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'id_user');
    }

    public function salle()
    {
        return $this->belongsTo(Salle::class, 'id_salle' , 'id_salle');
    }

    public function cours()
    {
        return $this->belongsTo(Cours::class, 'id_cours' , 'id_cours');
    }

    public function classe()
    {
        return $this->belongsTo(Classe::class, 'id_classe' , 'id_classe');
    }

}
