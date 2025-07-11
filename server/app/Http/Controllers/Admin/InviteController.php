<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
//use App\Models\Users\UserInvitation;
use App\Models\Users\User;
use App\Models\Users\UserPermission;
use App\Helpers\EmailHelper;
use App\Models\Menus\Menu;
use Illuminate\Support\Facades\Validator;

class InviteController extends Controller
{
    public function send(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'email' => 'required|email|unique:users,email|unique:user_invitations,email',
            'role_id' => 'required|in:2,3',
        ]);

        $token = Str::uuid();

        User::create([
            'token' => $token,
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'role_id' => $request->role_id,
            'expires_at' => now()->addDays(2),
        ]);

        $registerUrl = config('app.frontend_url') . "register?token={$token}";

        $sent = EmailHelper::send(
            $request->email,
            'You’ve been invited to Everyday CRM',
            'emails.invite-user',
            [
                'name' => $request->first_name,
                'register_url' => $registerUrl,
            ]
        );

        if (!$sent) {
            return response()->json(['message' => 'Failed to send invitation email'], 500);
        }

        return response()->json(['status' => true, 'message' => 'Invitation sent successfully.']);
    }


    public function inviteUser(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'email' => 'required|email|unique:users,email',
                'first_name' => 'required|string|max:100',
                'last_name' => 'required|string|max:100',
                'role_id' => 'required|exists:roles,id',
                'permissions' => 'nullable|array',
                'permissions.*' => 'integer|exists:menus,id',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'errors' => $validator->errors(),
                ], 422);
            }

            // Group permissions as { parent_id: [child_id, ...] }
            $menuIds = collect($request->permissions ?? []);
            $menus = Menu::whereIn('id', $menuIds)->get();

            $grouped = [];
            foreach ($menus as $menu) {
                $parentId = $menu->parent_id ?: $menu->id;
                if (!isset($grouped[$parentId])) {
                    $grouped[$parentId] = [];
                }
                if ($menu->parent_id) {
                    $grouped[$menu->parent_id][] = $menu->id;
                }
            }

            foreach ($grouped as &$children) {
                $children = array_values(array_unique($children));
            }

            // Step 1: Create the user
            $user = User::create([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'email' => $request->email,
                'role_id' => $request->role_id,
                'token' => Str::uuid(),
                'expires_at' => now()->addDays(2),
                'is_registered' => false,
                'status' => 0, // inactive until registration
            ]);

            // Step 2: Save permissions in user_permissions table
            UserPermission::updateOrCreate(
                ['user_id' => $user->id],
                ['permissions' => $grouped]
            );

            // Step 3: Send email invitation
            EmailHelper::send(
                $user->email,
                'You’re invited to Everyday CRM!',
                'emails.invite-user',
                [
                    'name' => $user->first_name,
                    'register_url' => config('app.frontend_url') . 'register?token=' . $user->token,
                ]
            );

            return response()->json([
                'status' => true,
                'message' => 'Invitation sent successfully',
                'data' => $user
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Error inviting user',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
