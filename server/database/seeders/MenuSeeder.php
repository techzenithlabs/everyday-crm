<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Menu;

class MenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
       $menus = [
            ['name' => 'Users', 'slug' => 'users', 'path' => '/users', 'icon' => 'users'],
            ['name' => 'Projects', 'slug' => 'projects', 'path' => '/projects', 'icon' => 'check-square'],
            ['name' => 'Invoices', 'slug' => 'invoices', 'path' => '/invoices', 'icon' => 'file-text'],
            ['name' => 'Clients', 'slug' => 'clients', 'path' => '/clients', 'icon' => 'users'],
            ['name' => 'Leads', 'slug' => 'leads', 'path' => '/leads', 'icon' => 'zap'],
            ['name' => 'Calendar', 'slug' => 'calendar', 'path' => '/calendar', 'icon' => 'calendar-days'],
            ['name' => 'Payroll', 'slug' => 'payroll', 'path' => '/payroll', 'icon' => 'wallet'],
        ];

        foreach ($menus as $menu) {
            Menu::create($menu);
        }
    }
}
