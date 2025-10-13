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
            ['nom'=>'Rachad','prenom'=>'Ahmed Combo','email'=>'bent35005@gmail.com','password'=>Hash::make('password'),'role_id'=>1],
            ['nom'=>'Fall','prenom'=>'Moussa','email'=>'enseignant1@test.com','password'=>Hash::make('password'),'role_id'=>2],
            ['nom'=>'Diallo','prenom'=>'Awa','email'=>'etudiant1@test.com','password'=>Hash::make('password'),'role_id'=>3],
            ['nom'=>'Seck','prenom'=>'Fatou','email'=>'technicien@test.com','password'=>Hash::make('password'),'role_id'=>4],
            ['nom'=>'Mbaye','prenom'=>'Ali','email'=>'guest@test.com','password'=>Hash::make('password'),'role_id'=>5],
        ];

        DB::table('users')->insert($users);
    }
}
