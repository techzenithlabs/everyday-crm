<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Password;
use App\Models\User;
use Illuminate\Mail\Mailables\Headers;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Str;
use App\Helpers\Helper;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6',
            'role_id' => 'required|in:1,2,3',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role_id' => $request->role_id,
            'status' => 1,
        ]);

        return response()->json(['message' => 'User registered successfully'], 201);
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'Invalid email address.',
            ], 401);
        }

        if (!Hash::check($request->password, $user->password)) {
            return response()->json([
                'status' => false,
                'message' => 'Incorrect password.',
            ], 401);
        }

        if ($user->status != 1) {
            return response()->json([
                'status' => false,
                'message' => 'Your account is inactive. Please contact admin.',
            ], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => true,
            'message' => 'Login successful',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'email' => $user->email,
                'role_id' => $user->role_id,
            ],
        ]);
    }


    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }


    public function sendResetLinkEmail(Request $request)
    {

        try {
            $request->validate(['email' => 'required|email']);
            $checkemail = User::where('email', $request->email)->first();

            if (!$checkemail) {
                return response()->json(['status' => false, 'message' => 'Sorry user not found with this email address.'], 404);
            }


            $status = Password::sendResetLink(
                $request->only('email')
            );

            if ($status === Password::RESET_LINK_SENT) {
                return response()->json(['message' => __($status)], 200);
            }

            return response()->json(['message' => __($status)], 400);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function redirectToProvider($provider)
    {
        return Socialite::driver($provider)->stateless()->redirect();
    }

    public function handleProviderCallback($provider)
    {
        try {
            $REACT_APP_URL = env('REACT_APP_URL', 'http://localhost:5173');
            $driver = $provider === 'slack' ? 'slack_oauth' : $provider;

            $socialUser = Socialite::driver($driver)->stateless()->user();
            $email = $socialUser->getEmail();

            $user = User::where('email', $email)->first();

            if (!$user) {
                $role = $email === 'admin@gmail.com'
                    ? env('ROLE_ID_ADMIN', 1)
                    : env('ROLE_ID_USER', 3);

                $names = Helper::extractNamesFromEmail($email);

                $user = User::create([
                    'first_name' => $names['first_name'],
                    'last_name' => $names['last_name'],
                    'name' => $socialUser->getName() ?? $socialUser->getNickname() ?? "{$names['first_name']} {$names['last_name']}",
                    'email' => $email,
                    'email_verified_at' => now(),
                    'password' => Hash::make(env('DEFAULT_USER_PASSWORD', 'User@123')),
                    'role_id' => $role,
                    'status' => 1,
                ]);
            }

            if ($user->status != 1) {
                return response()->json(['message' => 'Your account is inactive.'], 403);
            }

            $token = $user->createToken('auth_token')->plainTextToken;
            return redirect("{$REACT_APP_URL}/social-success?token={$token}");
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Authentication failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
