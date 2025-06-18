<?php

namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Role;

class RoleController extends Controller
{
    public function index()
    {
        $roles = Role::whereNotIn('id',[1])->select('id', 'name')->get(); // only return necessary columns
        return response()->json([
            'status' => true,
            'message' => 'roles fetched successfully',
            'roles'=>$roles
        ]);
    }
}
