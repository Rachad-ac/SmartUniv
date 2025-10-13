<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ReservationsSeeder extends Seeder
{
    public function run()
    {
        $reservations = [
            ['date_debut'=>'2025-10-15 08:00:00','date_fin'=>'2025-10-15 10:00:00','type_reservation'=>'Cours','statut'=>'En attente','motif'=>'Cours de TP','description'=>'TP Algorithmique','id_user'=>3,'id_salle'=>2,'id_cours'=>1,'id_filiere'=>1,'id_classe'=>1],
            ['date_debut'=>'2025-10-16 10:00:00','date_fin'=>'2025-10-16 12:00:00','type_reservation'=>'Examen','statut'=>'En attente','motif'=>'Examen final','description'=>'Mathématiques','id_user'=>3,'id_salle'=>1,'id_cours'=>2,'id_filiere'=>2,'id_classe'=>3],
            ['date_debut'=>'2025-10-17 09:00:00','date_fin'=>'2025-10-17 11:00:00','type_reservation'=>'TP','statut'=>'En attente','motif'=>'TP Physique','description'=>'Expérience mécanique','id_user'=>2,'id_salle'=>4,'id_cours'=>3,'id_filiere'=>3,'id_classe'=>4],
            ['date_debut'=>'2025-10-18 13:00:00','date_fin'=>'2025-10-18 15:00:00','type_reservation'=>'Cours','statut'=>'En attente','motif'=>'Cours Chimie','description'=>'Laboratoire Chimie','id_user'=>2,'id_salle'=>4,'id_cours'=>4,'id_filiere'=>4,'id_classe'=>4],
            ['date_debut'=>'2025-10-19 08:00:00','date_fin'=>'2025-10-19 10:00:00','type_reservation'=>'Cours','statut'=>'En attente','motif'=>'Cours Biologie','description'=>'Biologie Cellulaire','id_user'=>3,'id_salle'=>5,'id_cours'=>5,'id_filiere'=>5,'id_classe'=>5],
        ];

        DB::table('reservations')->insert($reservations);
    }
}
