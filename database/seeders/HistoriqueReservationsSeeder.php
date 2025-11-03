<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class HistoriqueReservationsSeeder extends Seeder
{
    public function run()
    {
        $historiques = [
            ['reservation_id'=>1,'utilisateur_id'=>3,'action'=>'Création','details'=>'Réservation initiale'],
            ['reservation_id'=>2,'utilisateur_id'=>3,'action'=>'Création','details'=>'Réservation initiale'],
            ['reservation_id'=>3,'utilisateur_id'=>2,'action'=>'Création','details'=>'Réservation initiale'],
            ['reservation_id'=>4,'utilisateur_id'=>2,'action'=>'Création','details'=>'Réservation initiale'],
            ['reservation_id'=>5,'utilisateur_id'=>3,'action'=>'Création','details'=>'Réservation initiale'],
        ];

        DB::table('historique_reservations')->insert($historiques);
    }
}
