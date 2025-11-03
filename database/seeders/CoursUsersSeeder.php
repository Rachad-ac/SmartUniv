<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CoursUsersSeeder extends Seeder
{
    public function run()
    {
        $coursUser = [
            ['cours_id'=>1,'user_id'=>2],
            ['cours_id'=>2,'user_id'=>2],
            ['cours_id'=>3,'user_id'=>2],
            ['cours_id'=>1,'user_id'=>3],
            ['cours_id'=>5,'user_id'=>3],
        ];

        DB::table('cours_user')->insert($coursUser);
    }
}
