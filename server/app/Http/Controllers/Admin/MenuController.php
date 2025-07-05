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
        $user = Auth::user();

        if ($user->role_id === 1) {
            // Admin sees all menus
            $menus = Menu::orderBy('sort_order')->get();
        } else {
            // Other roles see only permitted menus (adjust as needed)
            $menus = Menu::where('is_active', true)
                ->whereHas('permissions', function ($query) use ($user) {
                    $query->whereIn('id', $user->permissions->pluck('id'));
                })
                ->orderBy('sort_order')
                ->get();
        }

        return response()->json([
            'status' => true,
            'menus' => $menus
        ]);
    }
}
