<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Roles\Permission; // Assuming you have a Permission model in Roles namespace

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $permissions = [
            ['name' => 'view dashboard', 'menu_id' => 1],
            ['name' => 'view clients', 'menu_id' => 2],
            ['name' => 'add client', 'menu_id' => 3],
            ['name' => 'edit client', 'menu_id' => 4],
            ['name' => 'view projects', 'menu_id' => 5],
            ['name' => 'view jobs', 'menu_id' => 6],
            ['name' => 'view permits', 'menu_id' => 7],
            ['name' => 'view marketing', 'menu_id' => 8],
            ['name' => 'view referrals', 'menu_id' => 9],
            ['name' => 'view email campaigns', 'menu_id' => 10],
            ['name' => 'view text campaigns', 'menu_id' => 11],
            ['name' => 'view social media', 'menu_id' => 12],
            ['name' => 'view users', 'menu_id' => 13],
            ['name' => 'view invoices', 'menu_id' => 14],
            ['name' => 'view leads', 'menu_id' => 15],
            ['name' => 'view calendar', 'menu_id' => 16],
            ['name' => 'view payroll', 'menu_id' => 17],
            ['name' => 'view team', 'menu_id' => 18],
            ['name' => 'view sales', 'menu_id' => 19],
        ];

        foreach ($permissions as $permission) {
            Permission::create([
                'name'       => $permission['name'],
                'guard_name' => 'web',
                'menu_id'    => $permission['menu_id'],
                'can_read'   => true,
                'can_write'  => true,
                'can_update' => true,
                'can_delete' => true,
            ]);
        }

        echo "✅ Permissions seeded successfully.\n";
    }

}
