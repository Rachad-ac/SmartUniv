<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MatieresSeeder extends Seeder
{
    public function run()
    {
        $matieres = [
            ['nom'=>'Algorithmique','code'=>'ALGO','description'=>'Cours d’algorithmique'],
            ['nom'=>'Mathématiques Discrètes','code'=>'MATHD','description'=>'Bases de mathématiques discrètes'],
            ['nom'=>'Physique Générale','code'=>'PHYSG','description'=>'Introduction à la physique'],
            ['nom'=>'Chimie Organique','code'=>'CHIMO','description'=>'Chimie des composés organiques'],
            ['nom'=>'Biologie Cellulaire','code'=>'BIOC','description'=>'Étude des cellules'],
        ];

        DB::table('matieres')->insert($matieres);
    }
}
