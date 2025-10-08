<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
class ClasseFiliereSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('classe_filiere')->insert([
            ['id_classe' => 1, 'id_filiere' => 1],
            ['id_classe' => 2, 'id_filiere' => 1],
        ]);
    }
}
