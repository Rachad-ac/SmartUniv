<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Seeder;

class reservationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('reservations')->insert([
            [
                'date_debut' => '2025-10-08 09:00:00',
                'date_fin' => '2025-10-08 11:00:00',
                'type_reservation' => 'Cours',
                'statut' => 'En attente',
                'id_user' => 2,
                'id_salle' => 1,
                'id_cours' => 1
            ],
        ]);
    }
}
