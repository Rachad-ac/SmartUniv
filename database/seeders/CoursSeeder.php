<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CoursSeeder extends Seeder
{
    public function run()
    {
        $cours = [
            ['nom'=>'Algorithmes et Structures','code'=>'ALGO101','description'=>'Introduction aux algorithmes','semestre'=>'S1','volume_horaire'=>40,'id_matiere'=>1,'id_filiere'=>1],
            ['nom'=>'Mathématiques Discrètes Avancées','code'=>'MATH201','description'=>'Approfondissement','semestre'=>'S2','volume_horaire'=>35,'id_matiere'=>2,'id_filiere'=>1],
            ['nom'=>'Physique des Mécaniques','code'=>'PHYS101','description'=>'Mécanique classique','semestre'=>'S1','volume_horaire'=>30,'id_matiere'=>3,'id_filiere'=>3],
            ['nom'=>'Chimie Laboratoire','code'=>'CHIM101','description'=>'Pratique en chimie','semestre'=>'S1','volume_horaire'=>25,'id_matiere'=>4,'id_filiere'=>4],
            ['nom'=>'Biologie Cellulaire Avancée','code'=>'BIO101','description'=>'Cellules et organites','semestre'=>'S2','volume_horaire'=>30,'id_matiere'=>5,'id_filiere'=>5],
        ];

        DB::table('cours')->insert($cours);
    }
}
