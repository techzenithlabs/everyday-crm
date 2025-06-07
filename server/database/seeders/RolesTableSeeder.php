<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RolesTableSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('roles')->insert([
            ['id' => 1, 'name' => 'Admin', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 2, 'name' => 'Manager', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 3, 'name' => 'Employee', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}

