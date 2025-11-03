<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EquipementsSeeder extends Seeder
{
    public function run()
    {
        $equipements = [
            ['nom'=>'Projecteur','quantite'=>5,'description'=>'Projecteur HD','id_salle'=>1],
            ['nom'=>'Ordinateur','quantite'=>10,'description'=>'PC pour TP','id_salle'=>2],
            ['nom'=>'Tableau Blanc','quantite'=>2,'description'=>'Tableau interactif','id_salle'=>3],
            ['nom'=>'Microscope','quantite'=>4,'description'=>'Pour TP Biologie','id_salle'=>4],
            ['nom'=>'Chaises','quantite'=>30,'description'=>'Chaises confortables','id_salle'=>5],
        ];

        DB::table('equipements')->insert($equipements);
    }
}
