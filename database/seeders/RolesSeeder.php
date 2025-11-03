<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RolesSeeder extends Seeder
{
    
    public function run()
    {

        $roles = [
            ['nom' => 'Admin', 'description' => 'Administrateur du système'],
            ['nom' => 'Enseignant', 'description' => 'Professeur'],
            ['nom' => 'Etudiant', 'description' => 'Étudiant inscrit'],
            ['nom' => 'Chef-filiere', 'description' => 'Responsable filieres'],
            ['nom' => 'Assistante', 'description' => 'Utilisateur assistant l\'admin dans la saisie'],
        ];

        DB::table('roles')->insert($roles);
    }
}
