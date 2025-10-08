<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Seeder;

class notificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('notifications')->insert([
            ['message' => 'Votre réservation a été acceptée', 'id_user' => 3, 'id_reservation' => 1, 'lu' => false],
        ]);
    }
}
