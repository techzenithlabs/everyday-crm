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
            'current_password'  => 'required|string',
            'phone'             => 'nullable|string|regex:/^[0-9+\-\s\(\)]{7,20}$/',
            'address'           => 'nullable|string|max:255',
            'password'          => 'nullable|string|min:6|confirmed',
            
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

        $userInfo = $user->info;

        if (!$userInfo) {
            $userInfo = new UserInfo();
            $userInfo->user_id = $user->id;
        }

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
