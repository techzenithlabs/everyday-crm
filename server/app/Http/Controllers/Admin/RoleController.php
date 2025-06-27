<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use App\Models\RoleGroup;

class RoleController extends Controller
{
    public function index() {}

    public function getRoles()
    {
        $roles = Role::whereNotIn('id', [1])->get(); // exclude superadmin
        return response()->json([
            'status' => true,
            'message' => 'Roles fetched successfully',
            'roles' => $roles
        ]);
    }


    public function grouped()
    {
        $groups = RoleGroup::with('roles:id,name,role_group_id')->get(['id', 'name']);

        return response()->json([
            'status' => true,
            'message' => 'Grouped roles fetched successfully',
            'groups' => $groups
        ]);
    }
}
