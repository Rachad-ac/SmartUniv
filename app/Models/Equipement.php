<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

use Illuminate\Database\Eloquent\Model;

class Equipement extends Model
{
    protected $fillable = ['nom', 'quantite', 'description'];

    public function salle()
    {
         return $this->belongsTo(Salle::class);
    }
}
