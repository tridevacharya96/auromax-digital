<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('admins')->insert([
            'name'       => 'Tridev Acharya',
            'email'      => 'admin@auromaxdigital.com',
            'password'   => Hash::make('Auromax@2024'),
            'role'       => 'superadmin',
            'is_active'  => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
