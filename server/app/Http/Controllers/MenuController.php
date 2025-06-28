<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Menu;

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
}
