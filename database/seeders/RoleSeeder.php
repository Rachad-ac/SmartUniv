<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use Illuminate\Support\Facades\DB;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('roles')->insert([
            [
                'id' => 1,
                'role' => 'Admin',
                'desc' => 'Administrateur du system',
                'created_at' => now(),
                'updated_at' => now(),
           ],
           [
               'id' => 2,
               'role' => 'Etudiant',
               'desc' => 'Etudiant de l etablissement',
               'created_at' => now(),
               'updated_at' => now(),
           ],
           [
               'id' => 3,
               'role' => 'Enseignant',
               'desc' => 'Enseignant des filieres',
               'created_at' => now(),
               'updated_at' => now(),
           ],
       ]);
    }
}
