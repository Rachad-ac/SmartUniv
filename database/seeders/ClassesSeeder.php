<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ClassesSeeder extends Seeder
{
    public function run()
    {
        $classes = [
            ['nom'=>'INFO1','niveau'=>'Licence 1','effectif'=>30,'id_filiere'=>1],
            ['nom'=>'INFO2','niveau'=>'Licence 2','effectif'=>28,'id_filiere'=>1],
            ['nom'=>'MATH1','niveau'=>'Licence 1','effectif'=>25,'id_filiere'=>2],
            ['nom'=>'PHYS1','niveau'=>'Licence 1','effectif'=>20,'id_filiere'=>3],
            ['nom'=>'BIO1','niveau'=>'Licence 1','effectif'=>22,'id_filiere'=>5],
        ];

        DB::table('classes')->insert($classes);
    }
}
