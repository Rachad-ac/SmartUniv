<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class userSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('users')->insert([
            [
                'nom' => 'Rachad',
                'prenom' => 'Ahmed Combo',
                'email' => 'bent35005@gmail.com',
                'password' => Hash::make('rachad123'),
                'role' => 'Admin',
            ],
            ['nom' => 'Ali', 'prenom' => 'Enseignant', 'email' => 'ali@univ.com', 'password' => Hash::make('password'), 'role' => 'Enseignant'],
            ['nom' => 'Fatou', 'prenom' => 'Etudiant', 'email' => 'fatou@univ.com', 'password' => Hash::make('password'), 'role' => 'Etudiant'],
            [
            'nom' => 'Sow',
            'prenom' => 'Ali',
            'email' => 'ali@example.com',
            'password' => Hash::make('ali12345'),
            'role' => 'Etudiant',
            ],
            [
            'nom' => 'Ba',
            'prenom' => 'Said',
            'email' => 'said@example.com',
            'password' => Hash::make('said1234'),
            'role' => 'Enseignant',
        ]
        ]);
    }
}
