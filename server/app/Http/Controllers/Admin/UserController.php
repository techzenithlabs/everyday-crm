<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\UserInvitation;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Mail;
use App\Mail\InviteUserMail;

class UserController extends Controller
{
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

    public function inviteUser(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|unique:user_invitations,email',
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'role_id' => 'required|exists:roles,id',
            'permissions' => 'nullable|array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Step 1: Create invitation entry
        $invitation = UserInvitation::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'role_id' => $request->role_id,
            'token' => Str::random(40),
            'expires_at' => now()->addDays(2),
            'permissions' => json_encode($request->permissions ?? []), // JSON column
        ]);

        // Step 2: Send email (optional)
        // Mail::to($invitation->email)->send(new InviteUserMail($invitation));

        return response()->json([
            'status' => true,
            'message' => 'Invitation sent successfully',
            'data' => $invitation
        ]);
    }
}
