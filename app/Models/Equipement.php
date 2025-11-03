<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Equipement extends Model
{
    use HasFactory;

    protected $table = 'equipements';
    protected $primaryKey = 'id';
    public $timestamps = true;

    protected $fillable = [
        'nom',
        'quantite',
        'description',
        'id_salle',
    ];

    protected $casts = [
        'quantite' => 'integer',
    ];

    public function salle()
    {
        return $this->belongsTo(Salle::class, 'id_salle', 'id_salle');
    }
}
