<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Menu;
use Illuminate\Support\Facades\Auth;

class MenuController extends Controller
{
    public function getUserMenus()
    {
        $user = Auth::user();
        $menuAccess = $user->permissions()
            ->with('menu')
            ->get()
            ->pluck('menu')
            ->unique('id');

        return response()->json([
            'status' => true,
            'menus' => $menuAccess
        ]);
    }
}
