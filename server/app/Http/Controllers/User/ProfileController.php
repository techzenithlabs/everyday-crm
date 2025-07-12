<?php

namespace App\Http\Controllers\User;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Models\Users\UserInfo;


class ProfileController extends Controller
{
    /**
     * Show the authenticated user's profile.
     */
    public function show(Request $request)
    {
        //return response()->json($request->user());

        $user = $request->user()->load('info');

        return response()->json($user);
    }

    /**
     * Update the authenticated user's profile.
     */
    public function update(Request $request)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'first_name'        => 'required|string|max:255',
            'last_name'         => 'required|string|max:255',
            'email'             => 'required|email|max:255|unique:users,email,' . $user->id,
            'current_password'  => 'nullable|string',
            'password'          => 'nullable|string|min:6|confirmed',
            'phone'             => 'nullable|string|regex:/^[0-9+\-\s\(\)]{7,20}$/',
            'address'           => 'nullable|string|max:255',
            'city'              => 'nullable|string|max:100',
            'state'             => 'nullable|string|max:100',
            'postal_code'       => 'nullable|string|regex:/^\d{4,10}$/',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $validator->validated();

        // ✅ Basic profile update
        $user->first_name = $data['first_name'];
        $user->last_name  = $data['last_name'];
        $user->email      = $data['email'];

        // ✅ If password is provided, validate and update
        if (!empty($data['password'])) {
            if (empty($data['current_password'])) {
                return response()->json([
                    'status' => false,
                    'message' => 'Current password is required to change password',
                ], 422);
            }

            if (!Hash::check($data['current_password'], $user->password)) {
                return response()->json([
                    'status' => false,
                    'message' => 'Current password is incorrect',
                ], 422);
            }

            $user->password = Hash::make($data['password']);
        }

        $user->save();

        // ✅ Update info table
        $userInfo = $user->info ?? new \App\Models\Users\UserInfo();
        $userInfo->user_id = $user->id;
        $userInfo->phone        = $data['phone'] ?? null;
        $userInfo->address      = $data['address'] ?? null;
        $userInfo->city         = $data['city'] ?? null;
        $userInfo->state        = $data['state'] ?? null;
        $userInfo->postal_code  = $data['postal_code'] ?? null;
        $userInfo->save();

        return response()->json([
            'status' => true,
            'message' => 'Profile updated successfully',
            'user' => $user->load('info'),
        ]);
    }
}
