<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Seeder;

class classeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('classes')->insert([
            ['id_filiere' => 1, 'nom' => 'L2 Informatique', 'niveau' => 'Licence 2'],
            ['id_filiere' => 1, 'nom' => 'L3 Informatique', 'niveau' => 'Licence 3'],
        ]);

    }
}
