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
        try {
            $permissions = Menu::with('children:id,parent_id,name')
                ->whereNull('parent_id')
                ->select('id', 'name')
                ->get()
                ->map(function ($menu) {
                    return [
                        'id' => $menu->id,
                        'name' => $menu->name,
                        'children' => $menu->children->map(function ($child) {
                            return [
                                'id' => $child->id,
                                'name' => $child->name,
                            ];
                        })->toArray(),
                    ];
                });

            return response()->json([
                'status' => true,
                'data' => $permissions,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Error fetching permissions',
                'error' => $e->getMessage(),
            ], 500);
        }
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
