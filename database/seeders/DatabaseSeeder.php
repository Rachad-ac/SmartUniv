<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            UserSeeder::class,
            SalleSeeder::class,
            FiliereSeeder::class,
            MatiereSeeder::class,
            CourSeeder::class,
            ReservationSeeder::class,
            NotificationSeeder::class,
            ClasseSeeder::class,
            PlanningSeeder::class,
                EtudiantSeeder::class,
                EnseignantSeeder::class,
                EnseignantMatiereSeeder::class,
                EtudiantFiliereSeeder::class,
                ClasseFiliereSeeder::class,
        ]);
    }
}
