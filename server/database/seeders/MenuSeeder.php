<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Menus\Menu;
use Illuminate\Support\Facades\DB;

class MenuSeeder extends Seeder
{
    public function run(): void
    {
        // Optional: clear old menus
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('menus')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // 1. Top-level: Home
        Menu::create([
            'name' => 'Home',
            'slug' => 'home',
            'path' => '/dashboard',
            'icon' => 'home',
            'is_active' => 1,
            'sort_order' => 0,
        ]);

        // 2. Clients and submenus
        $clients = Menu::create([
            'name' => 'Clients',
            'slug' => 'clients',
            'path' => '/clients',
            'icon' => 'users',
            'is_active' => 1,
            'sort_order' => 1,
        ]);

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

        // 3. Projects + child menus
        $projects = Menu::create([
            'name' => 'Projects',
            'slug' => 'projects',
            'path' => '/projects',
            'icon' => 'check-square',
            'is_active' => 1,
            'sort_order' => 2,
        ]);

        Menu::create([
            'name' => 'Jobs Board',
            'slug' => 'jobs-board',
            'path' => '/projects/:id/jobs',
            'icon' => 'columns',
            'parent_id' => $projects->id,
            'breadcrumb' => 'Projects > Jobs Board',
            'is_active' => 1,
            'sort_order' => 0,
        ]);

        Menu::create([
            'name' => 'Permits Board',
            'slug' => 'permits-board',
            'path' => '/projects/:id/permits',
            'icon' => 'check-circle',
            'parent_id' => $projects->id,
            'breadcrumb' => 'Projects > Permits Board',
            'is_active' => 1,
            'sort_order' => 1,
        ]);

        // 4. Marketing + child menus
        $marketing = Menu::create([
            'name' => 'Marketing',
            'slug' => 'marketing',
            'path' => '/marketing',
            'icon' => 'zap',
            'is_active' => 1,
            'sort_order' => 3,
        ]);

        $marketingChildren = [
            ['name' => 'Referrals', 'slug' => 'referrals', 'path' => '/marketing/referrals'],
            ['name' => 'Email Campaigns', 'slug' => 'email-campaigns', 'path' => '/marketing/email'],
            ['name' => 'Text Campaigns', 'slug' => 'text-campaigns', 'path' => '/marketing/text'],
            ['name' => 'Social Media', 'slug' => 'social-media', 'path' => '/marketing/social'],
        ];

        foreach ($marketingChildren as $index => $child) {
            Menu::create([
                'parent_id' => $marketing->id,
                'name' => $child['name'],
                'slug' => $child['slug'],
                'path' => $child['path'],
                'icon' => 'zap',
                'breadcrumb' => "Marketing > {$child['name']}",
                'is_active' => 1,
                'sort_order' => $index,
            ]);
        }

        // 5. Flat top-level menus (no children yet)
        $flatMenus = [
            ['name' => 'Users',    'slug' => 'users',    'path' => '/users',         'icon' => 'users',         'sort_order' => 4],
            ['name' => 'Invoices', 'slug' => 'invoices', 'path' => '/invoices',      'icon' => 'file-text',     'sort_order' => 5],
            ['name' => 'Leads',    'slug' => 'leads',    'path' => '/leads',         'icon' => 'zap',           'sort_order' => 6],
            ['name' => 'Calendar', 'slug' => 'calendar', 'path' => '/calendar',      'icon' => 'calendar-days', 'sort_order' => 7],
            ['name' => 'Payroll',  'slug' => 'payroll',  'path' => '/payroll',       'icon' => 'wallet',        'sort_order' => 8],
            ['name' => 'Team',     'slug' => 'team',     'path' => '/admin/teams',   'icon' => 'users',         'sort_order' => 9],
            ['name' => 'Sales',    'slug' => 'sales',    'path' => '/sales',         'icon' => 'wallet',        'sort_order' => 10],
        ];

        foreach ($flatMenus as $menu) {
            Menu::create([
                ...$menu,
                'is_active' => 1,
            ]);
        }
    }
}
