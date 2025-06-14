<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;


class ProfileController extends Controller
{
    /**
     * Show the authenticated user's profile.
     */
    public function show(Request $request)
    {
        return response()->json($request->user());
    }

    /**
     * Update the authenticated user's profile.
     */
    public function update(Request $request)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'first_name'        => 'nullable|string|max:255',
            'last_name'         => 'nullable|string|max:255',
            'email'             => 'required|email|max:255|unique:users,email,' . $user->id,
            'current_password'  => 'nullable|string',
            'password'          => 'nullable|string|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $validator->validated();

        // ✅ Update basic profile info
        $user->first_name = $data['first_name'] ?? $user->first_name;
        $user->last_name  = $data['last_name'] ?? $user->last_name;
        $user->email      = $data['email'];

        // ✅ Handle password change
        if (!empty($data['current_password'])) {
            if (!Hash::check($data['current_password'], $user->password)) {
                return response()->json([
                    'status' => false,
                    'message' => 'Current password is incorrect',
                ], 422);
            }

            if (empty($data['password']) || empty($request->password_confirmation)) {
                return response()->json([
                    'status' => false,
                    'message' => 'Please provide new and confirm password',
                ], 422);
            }

            $user->password = Hash::make($data['password']);
        }

        $user->save();

        return response()->json([
            'status' => true,
            'message' => 'Profile updated successfully',
            'user' => $user
        ]);
    }
}
