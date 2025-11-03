<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 🔹 Les rôles doivent être créés avant les utilisateurs
        $this->call([
            RolesSeeder::class,
        ]);

        // 🔹 Utilisateurs
        $this->call([
            UsersSeeder::class,
        ]);

        // 🔹 Filières et pivot user_filiere
        $this->call([
            FilieresSeeder::class,
        ]);

        // 🔹 Salles et équipements
        $this->call([
            SallesSeeder::class,
            EquipementsSeeder::class,
        ]);

        // 🔹 Matières et cours
        $this->call([
            MatieresSeeder::class,
            CoursSeeder::class,
            CoursUsersSeeder::class,
        ]);

        // 🔹 Classes et pivot user_classe
        $this->call([
            ClassesSeeder::class,
            UsersClassesSeeder::class,
        ]);

        // 🔹 Réservations
        $this->call([
            ReservationsSeeder::class,
        ]);

        // 🔹 Plannings
        $this->call([
            PlanningsSeeder::class,
        ]);

        // 🔹 Notifications
        $this->call([
            NotificationsSeeder::class,
        ]);

        // 🔹 Historique des réservations
        $this->call([
            HistoriqueReservationsSeeder::class,
        ]);
    }
}
