<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
//use App\Models\Users\UserInvitation;
use App\Models\Users\User;
use App\Helpers\EmailHelper;

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
            'role_id' => $request->role_id,
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'token' => $token,
            'status' => 0, // 0 = pending, 1 = active
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
}
