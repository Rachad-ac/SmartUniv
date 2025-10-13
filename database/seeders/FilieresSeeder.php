<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FilieresSeeder extends Seeder
{
    public function run()
    {
        $filieres = [
            ['nom'=>'Informatique','code'=>'INFO','description'=>'Filière informatique'],
            ['nom'=>'Mathématiques','code'=>'MATH','description'=>'Filière Mathématiques'],
            ['nom'=>'Physique','code'=>'PHYS','description'=>'Filière Physique'],
            ['nom'=>'Chimie','code'=>'CHIM','description'=>'Filière Chimie'],
            ['nom'=>'Biologie','code'=>'BIO','description'=>'Filière Biologie'],
        ];

        DB::table('filieres')->insert($filieres);
    }
}
