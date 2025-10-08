<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Planning;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class PlanningSeeder extends Seeder
{
    public function run(): void
    {
       DB::table('plannings')->insert([
        [
            'id_cours' => 1,
            'id_salle' => 1,
            'id_classe' => 1, // doit exister dans classes
            'id_user' => 2,   // doit exister dans users
            'date_debut' => '2025-10-08 09:00:00',
            'date_fin' => '2025-10-08 11:00:00',
            'description' => 'Cours de Programmation Web - HTML/CSS',
        ],
        [
            'id_cours' => 2,
            'id_salle' => 2,
            'id_classe' => 2,
            'id_user' => 3,
            'date_debut' => '2025-10-08 11:30:00',
            'date_fin' => '2025-10-08 13:00:00',
            'description' => 'Cours de Base de Données - MySQL',
        ]
    ]);

    }
}
