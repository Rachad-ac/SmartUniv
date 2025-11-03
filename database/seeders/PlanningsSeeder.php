<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PlanningsSeeder extends Seeder
{
    public function run()
    {
        $plannings = [
            ['id_cours'=>1,'id_salle'=>2,'id_classe'=>1,'id_user'=>3,'date_debut'=>'2025-10-15 08:00:00','date_fin'=>'2025-10-15 10:00:00' ,'description'=>'TP Algorithmique'],
            ['id_cours'=>2,'id_salle'=>1,'id_classe'=>3,'id_user'=>3,'date_debut'=>'2025-10-16 10:00:00','date_fin'=>'2025-10-16 12:00:00' ,'description'=>'Examen Mathématiques'],
            ['id_cours'=>3,'id_salle'=>4,'id_classe'=>4,'id_user'=>2,'date_debut'=>'2025-10-17 09:00:00','date_fin'=>'2025-10-17 11:00:00' ,'description'=>'TP Physique'],
            ['id_cours'=>4,'id_salle'=>4,'id_classe'=>4,'id_user'=>2,'date_debut'=>'2025-10-18 13:00:00','date_fin'=>'2025-10-18 15:00:00' ,'description'=>'Cours Chimie'],
            ['id_cours'=>5,'id_salle'=>5,'id_classe'=>5,'id_user'=>3,'date_debut'=>'2025-10-19 08:00:00','date_fin'=>'2025-10-19 10:00:00' ,'description'=>'Cours Biologie'],
        ];

        DB::table('plannings')->insert($plannings);
    }
}
