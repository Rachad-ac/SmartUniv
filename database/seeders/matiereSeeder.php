<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Seeder;

class matiereSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('matieres')->insert([
            ['nom' => 'Programmation Web', 'code' => 'PW', 'description' => 'HTML, CSS, JS'],
            ['nom' => 'Base de données', 'code' => 'BDD', 'description' => 'SQL et MySQL'],
        ]);
    }
}
