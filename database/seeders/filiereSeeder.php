<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Seeder;

class filiereSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('filieres')->insert([
            ['nom' => 'Informatique', 'code' => 'INFO', 'description' => 'Filière Informatique'],
            ['nom' => 'Mathématiques', 'code' => 'MATH', 'description' => 'Filière Mathématiques'],
        ]);
    }
}
