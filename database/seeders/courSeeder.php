<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Seeder;

class courSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('cours')->insert([
            ['nom' => 'Programmation Web', 'code' => 'PW101', 'id_matiere' => 1, 'id_filiere' => 1],
            ['nom' => 'Base de Données', 'code' => 'BD101', 'id_matiere' => 2, 'id_filiere' => 1],
        ]);
    }
}
