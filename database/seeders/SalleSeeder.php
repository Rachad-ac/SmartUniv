<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Seeder;

class SalleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('salles')->insert([
            ['nom' => 'Salle 101', 'type_salle' => 'Cours', 'capacite' => 30, 'localisation' => 'Bâtiment A'],
            ['nom' => 'Amphi 1', 'type_salle' => 'Amphi', 'capacite' => 100, 'localisation' => 'Bâtiment B'],
        ]);
    }
}
