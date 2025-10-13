<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UsersFilieresSeeder extends Seeder
{
    public function run()
    {
        $userFilieres = [
            ['id_user'=>3,'id_filiere'=>1],
            ['id_user'=>3,'id_filiere'=>2],
            ['id_user'=>2,'id_filiere'=>1],
            ['id_user'=>2,'id_filiere'=>3],
            ['id_user'=>5,'id_filiere'=>4],
        ];

        DB::table('user_filiere')->insert($userFilieres);
    }
}
