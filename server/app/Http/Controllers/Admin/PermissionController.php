<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;
use App\Models\Users\User;
use App\Models\Users\UserPermission;
use App\Models\Menus\Menu;

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
        $modules = Menu::select('id', 'name', 'slug', 'icon', 'parent_id')
            ->orderBy('parent_id') // optional for better grouping
            ->orderBy('name')
            ->get();

        return response()->json([
            'status' => true,
            'modules' => $modules
        ]);
    }

    // Get existing permissions of a user
    public function getUserPermissions($id)
    {
        try {
            $userPermissions = UserPermission::where('user_id', $id)->first();
            return response()->json([
                'status' => true,
                'data' => $userPermissions?->permissions ?? [],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Error fetching permissions',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Save/update permissions of a user
    public function updateUserPermissions(Request $request, $id)
    {
        //header("Access-Control-Allow-Origin: *");

        try {
            $validated = $request->validate([
                'permissions' => 'required|array',
            ]);

            $email=User::select('email')->findorFail($id); // Ensure user exists
            UserPermission::updateOrCreate(
                ['user_id' => $id],
                ['email'=>$email->email,'permissions' => $validated['permissions']]
            );

            return response()->json([
                'status' => true,
                'message' => 'Permissions updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Error updating permissions',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
