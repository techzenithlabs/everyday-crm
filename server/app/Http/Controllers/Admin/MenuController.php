<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Menus\Menu;

class MenuController extends Controller
{
    public function getUserMenus()
    {
        try {
            $user = Auth::user();

            if ($user->role_id == 1) {
                $allMenus = Menu::orderBy('sort_order')->get(); // assuming you have 'order' column
                return response()->json([
                    'status' => true,
                    'menus' => $allMenus
                ]);
            }

            // ✅ Other roles: return based on permissions
            $menuAccess = $user->permissions()
                ->with('menu')
                ->get()
                ->pluck('menu')
                ->unique('id')
                ->values(); // reset index

            return response()->json([
                'status' => true,
                'menus' => $menuAccess
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to fetch user menus',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function updateSortOrder(Request $request)
    {
        $user = auth()->user();
        if (!$user || $user->role_id !== 1) {
            return response()->json(['status' => false, 'message' => 'Unauthorized.'], 403);
        }

        $request->validate([
            'menu_order' => 'required|array',
        ]);

        foreach ($request->menu_order as $index => $menuId) {
            Menu::where('id', $menuId)->update(['sort_order' => $index]);
        }

        return response()->json(['status' => true, 'message' => 'Menu order updated successfully.']);
    }


    public function getSidebarMenus()
    {
        try {
            $user = Auth::user();

            // 🧠 Eager load permissions AND their roles
            $menus = Menu::with(['permissions.roles']) // ✅ important!
                ->when($user->role_id !== 1, function ($query) use ($user) {
                    return $query->where('is_active', true)
                        ->whereHas('permissions', function ($q) use ($user) {
                            $q->whereIn('id', $user->permissions->pluck('id'));
                        });
                })
                ->orderBy('sort_order')
                ->get();

            $menusWithAccess = $menus->map(function ($menu) {
                return array_merge($menu->toArray(), [
                    'roleAccess' => $menu->permissions
                        ->flatMap(function ($permission) {
                            return $permission->roles->pluck('id');
                        })
                        ->unique()
                        ->values(),
                ]);
            });

            return response()->json([
                'status' => true,
                'menus' => $menusWithAccess,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to fetch sidebar menus',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
