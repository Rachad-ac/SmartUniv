<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SallesSeeder extends Seeder
{
    public function run()
    {
        $salles = [
            ['nom'=>'Salle A','type_salle'=>'Cours','capacite'=>30,'localisation'=>'Bâtiment 1','etat'=>'Disponible'],
            ['nom'=>'Salle B','type_salle'=>'TP','capacite'=>25,'localisation'=>'Bâtiment 2','etat'=>'Disponible'],
            ['nom'=>'Amphi 1','type_salle'=>'Amphi','capacite'=>100,'localisation'=>'Bâtiment 1','etat'=>'Disponible'],
            ['nom'=>'Salle C','type_salle'=>'Cours','capacite'=>40,'localisation'=>'Bâtiment 3','etat'=>'Maintenance'],
            ['nom'=>'Salle D','type_salle'=>'TP','capacite'=>20,'localisation'=>'Bâtiment 2','etat'=>'Occupée'],
        ];

        DB::table('salles')->insert($salles);
    }
}
