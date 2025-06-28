<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Menu;
use Illuminate\Support\Facades\DB;

class MenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Optional: clear old menus
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        // Truncate the table to reset ID to 1
        DB::table('menus')->truncate();

        // Re-enable FK constraints
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // 1. Create top-level menus
        $home = Menu::create([
            'name' => 'Home',
            'slug' => 'home',
            'path' => '/dashboard',
            'icon' => 'home',
            'is_active' => 1,
            'sort_order' => 0,
        ]);

        $clients = Menu::create([
            'name' => 'Clients',
            'slug' => 'clients',
            'path' => '/clients',
            'icon' => 'users',
            'is_active' => 1,
            'sort_order' => 1,
        ]);

        // 2. Create child menus for "Clients"
        Menu::create([
            'name' => 'Add Client',
            'slug' => 'clients-add',
            'path' => '/clients/add',
            'icon' => 'user-plus',
            'parent_id' => $clients->id,
            'breadcrumb' => 'Clients > Add Client',
            'is_active' => 1,
            'sort_order' => 0,
        ]);

        Menu::create([
            'name' => 'Edit Client',
            'slug' => 'clients-edit',
            'path' => '/clients/edit',
            'icon' => 'users',
            'parent_id' => $clients->id,
            'breadcrumb' => 'Clients > Edit Client',
            'is_active' => 1,
            'sort_order' => 1,
        ]);

        // 3. Add other top-level menus as needed
        $menus = [
            ['name' => 'Users', 'slug' => 'users', 'path' => '/users', 'icon' => 'users', 'sort_order' => 2],
            ['name' => 'Projects', 'slug' => 'projects', 'path' => '/projects', 'icon' => 'check-square', 'sort_order' => 3],
            ['name' => 'Invoices', 'slug' => 'invoices', 'path' => '/invoices', 'icon' => 'file-text', 'sort_order' => 4],
            ['name' => 'Leads', 'slug' => 'leads', 'path' => '/leads', 'icon' => 'zap', 'sort_order' => 5],
            ['name' => 'Calendar', 'slug' => 'calendar', 'path' => '/calendar', 'icon' => 'calendar-days', 'sort_order' => 6],
            ['name' => 'Payroll', 'slug' => 'payroll', 'path' => '/payroll', 'icon' => 'wallet', 'sort_order' => 7],
            ['name' => 'Marketing', 'slug' => 'marketing', 'path' => '/marketing', 'icon' => 'zap', 'sort_order' => 8],
            ['name' => 'Team', 'slug' => 'team', 'path' => '/admin/teams', 'icon' => 'users', 'sort_order' => 9],
            ['name' => 'Sales', 'slug' => 'sales', 'path' => '/sales', 'icon' => 'wallet', 'sort_order' => 10],
        ];

        foreach ($menus as $menu) {
            Menu::create([
                ...$menu,
                'is_active' => 1,
            ]);
        }
    }
}
