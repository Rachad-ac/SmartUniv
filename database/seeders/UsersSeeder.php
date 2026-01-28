<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UsersSeeder extends Seeder
{
    public function run()
    {
        $users = [
            ['nom'=>'Rachad','prenom'=>'Ahmed Combo','email'=>'bent35005@gmail.com','password'=>Hash::make('password'),'role_id'=>1], //mail reel de messagerie admin
            ['nom'=>'Fall','prenom'=>'Moussa','email'=>'teacher@smartuniv.com','password'=>Hash::make('password'),'role_id'=>2],
            ['nom'=>'Diallo','prenom'=>'Awa','email'=>'student@smartuniv.com','password'=>Hash::make('password'),'role_id'=>3],
            ['nom'=>'Seck','prenom'=>'Fatou','email'=>'admin@smartuniv.com','password'=>Hash::make('password'),'role_id'=>1],
        ];

        DB::table('users')->insert($users);
    }
}
