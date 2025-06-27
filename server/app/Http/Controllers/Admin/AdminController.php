<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use App\Helpers\EmailHelper;
use Illuminate\Support\Str;
use App\Models\Role;
use App\Models\UserInvitation;

class AdminController extends Controller
{

    public function getRoles()
    {
        return Role::whereNotIn('id', [1])->get(); // Manager & User
    }

    public function inviteUser(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'email' => 'required|email|unique:users,email|unique:user_invitations,email',
            'role_id' => 'required|in:2,3',
        ]);

        $token = Str::uuid();

        UserInvitation::create([
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

    public function listInvitedUsers(Request $request)
    {
        try {
            $query = UserInvitation::with('role');

            if ($request->filled('search')) {
                $search = $request->input('search');
                $query->where(function ($q) use ($search) {
                    $q->where('first_name', 'like', "%$search%")
                        ->orWhere('last_name', 'like', "%$search%")
                        ->orWhere('email', 'like', "%$search%");
                });
            }

            $sortBy = $request->input('sort_by', 'created_at');
            $sortOrder = $request->input('sort_order', 'desc');

            $allowedSortFields = ['first_name', 'last_name', 'email', 'created_at', 'expires_at'];
            if (!in_array($sortBy, $allowedSortFields)) {
                $sortBy = 'created_at';
            }

            $query->orderBy($sortBy, $sortOrder);

            $perPage = $request->input('per_page', 10);
            $users = $query->paginate($perPage);

            return response()->json([
                'status' => true,
                'message' => 'Invited users fetched successfully',
                'data' => $users
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Error fetching invited users',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
