<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;
use App\Models\Menu;

class PermissionController extends Controller
{
    public function allGroupedPermissions()
    {
        $permissions = Permission::with('menu') // Assuming menu_id in permissions table
            ->get()
            ->groupBy('menu.name');

        return response()->json([
            'status' => true,
            'permissions' => $permissions
        ]);
    }

    // PermissionController.php
    public function getModulesWithPermissions()
    {
        $modules = Menu::with('permissions:id,name,guard_name,menu_id') // Make sure relation exists
            ->get(['id', 'name', 'slug', 'icon']);

        return response()->json([
            'status' => true,
            'modules' => $modules,
        ]);
    }

     public function listModules()
    {
        $modules = Menu::select('id', 'name', 'slug', 'icon')->get();

        return response()->json([
            'status' => true,
            'modules' => $modules
        ]);
    }
}
