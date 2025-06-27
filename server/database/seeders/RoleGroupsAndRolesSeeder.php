<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\DB;

class RoleGroupsAndRolesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        // Truncate in this exact order to avoid FK issues
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('role_has_permissions')->truncate();
        DB::table('model_has_roles')->truncate();
        DB::table('roles')->truncate();
        DB::table('role_groups')->truncate();

        // First: Insert Admin without role group
        $admin = Role::firstOrCreate([
            'id' => 1,
            'name' => 'Admin',
            'guard_name' => 'web',
        ]);

        // Then add role groups
        $salesGroup = DB::table('role_groups')->insertGetId(['name' => 'Sales']);
        $productionGroup = DB::table('role_groups')->insertGetId(['name' => 'Production']);
        $operationsGroup = DB::table('role_groups')->insertGetId(['name' => 'Operations']);

        // Other roles (ID will auto increment from 2 onward)
        $roles = [
            ['name' => 'Sales Manager', 'role_group_id' => $salesGroup],
            ['name' => 'Sales Team', 'role_group_id' => $salesGroup],
            ['name' => 'Production Manager', 'role_group_id' => $productionGroup],
            ['name' => 'Production Team', 'role_group_id' => $productionGroup],
            ['name' => 'Operations Manager', 'role_group_id' => $operationsGroup],
            ['name' => 'Operations Team', 'role_group_id' => $operationsGroup],
        ];

        foreach ($roles as $data) {
            Role::firstOrCreate([
                'name' => $data['name'],
                'guard_name' => 'web',
                'role_group_id' => $data['role_group_id'],
            ]);
        }
    }
}
