<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UsersClassesSeeder extends Seeder
{
    public function run()
    {
        $userClasses = [
            ['id_user'=>3,'id_classe'=>1],
            ['id_user'=>3,'id_classe'=>3],
            ['id_user'=>2,'id_classe'=>1],
            ['id_user'=>2,'id_classe'=>2],
            ['id_user'=>5,'id_classe'=>5],
        ];

        DB::table('user_classe')->insert($userClasses);
    }
}
