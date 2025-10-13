<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NotificationsSeeder extends Seeder
{
    public function run()
    {
        $notifications = [
            ['message'=>'Votre réservation a été créée','id_user'=>3,'id_reservation'=>1,'lu'=>false],
            ['message'=>'Votre réservation a été validée','id_user'=>3,'id_reservation'=>2,'lu'=>false],
            ['message'=>'Nouvelle réservation assignée','id_user'=>2,'id_reservation'=>3,'lu'=>false],
            ['message'=>'Salle en maintenance','id_user'=>2,'id_reservation'=>null,'lu'=>false],
            ['message'=>'Nouvel équipement disponible','id_user'=>5,'id_reservation'=>null,'lu'=>false],
        ];

        DB::table('notifications')->insert($notifications);
    }
}
