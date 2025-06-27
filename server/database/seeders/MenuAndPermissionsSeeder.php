<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Menu;
use App\Models\Permission;

class MenuAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        $menus = [
            ['name' => 'Home', 'slug' => 'home', 'path' => '/home', 'icon' => 'Home'],
            ['name' => 'Calendar', 'slug' => 'calendar', 'path' => '/calendar', 'icon' => 'CalendarDays'],
            ['name' => 'Clients', 'slug' => 'clients', 'path' => '/clients', 'icon' => 'Users2'],
            ['name' => 'Jobs', 'slug' => 'jobs', 'path' => '/jobs', 'icon' => 'CheckSquare'],
            ['name' => 'Leads', 'slug' => 'leads', 'path' => '/leads', 'icon' => 'Zap'],
            ['name' => 'Permits', 'slug' => 'permits', 'path' => '/permits', 'icon' => 'FileText'],
            ['name' => 'Marketing', 'slug' => 'marketing', 'path' => '/marketing', 'icon' => 'Zap'],
            ['name' => 'Team', 'slug' => 'team', 'path' => '/team', 'icon' => 'Users2'],
            ['name' => 'Sales', 'slug' => 'sales', 'path' => '/sales', 'icon' => 'Wallet'],
            ['name' => 'Payroll', 'slug' => 'payroll', 'path' => '/payroll', 'icon' => 'Wallet'],
        ];

        foreach ($menus as $index => $data) {
            $menu = Menu::updateOrCreate(
                ['slug' => $data['slug']],
                [
                    'name' => $data['name'],
                    'path' => $data['path'],
                    'icon' => $data['icon'],
                    'is_active' => true,
                    'sort_order' => $index + 1
                ]
            );

            // Create associated permission
            Permission::updateOrCreate(
                ['name' => 'access ' . strtolower($data['name'])],
                [
                    'guard_name' => 'web',
                    'menu_id' => $menu->id,
                    'can_read' => 1,
                    'can_write' => 1,
                    'can_update' => 1,
                    'can_delete' => 0,
                ]
            );
        }
    }
}
