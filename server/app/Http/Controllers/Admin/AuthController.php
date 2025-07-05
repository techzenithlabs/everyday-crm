<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\DB;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Str;
use App\Helpers\Helper;
use App\Helpers\EmailHelper;
use Illuminate\Support\Facades\Cache;
use App\Models\Users\User;
use App\Models\Users\UserInvitation;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'token' => 'required|uuid',
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'email' => 'required|email',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $invitation = UserInvitation::where('token', $request->token)
            ->where('used', false)
            ->where('expires_at', '>', now())
            ->first();

        if (!$invitation) {
            return response()->json(['message' => 'Token is invalid or expired'], 400);
        }

        if (User::where('email', $request->email)->exists()) {
            return response()->json(['message' => 'User already exists with this email.'], 409);
        }


        $user = User::create([
            'first_name' => $request->first_name,
            'last_name'  => $request->last_name,
            'email'      => $request->email,
            'role_id'    => $invitation->role_id,
            'password'   => Hash::make($request->password),
            'status'     => 0,
            'email_verified_at' => null,
        ]);


        $invitation->update(['used' => true, 'registered_at' => now()]);


        // ✅ Step 3: Create email verification token
        $verifyToken = Str::uuid();
        DB::table('email_verification_tokens')->insert([
            'user_id'    => $user->id,
            'token'      => $verifyToken,
            'expires_at' => now()->addHours(24),
        ]);

        // ✅ Step 4: Send verification email
        $verifyUrl = config('app.frontend_url', env('REACT_APP_URL')) . "verify-email?token={$verifyToken}";

        EmailHelper::send(
            $user->email,
            'Verify your email – Everyday CRM',
            'emails.verify-email', // Create this Blade template
            [
                'name' => $user->first_name,
                'url' => $verifyUrl,
            ]
        );

        // ✅ Step 5: Respond with frontend redirect URL
        return response()->json([
            'message' => 'User registered. Please verify your email.',
            'redirect' => '/check-email' // used in frontend to navigate
        ]);
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

    public function sendResetLinkEmail(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return response()->json(['status' => false, 'message' => 'User not found.'], 404);
        }

        // Create reset token
        $token = Password::broker()->createToken($user);

        // Create reset URL
        $resetUrl = url(config('app.frontend_url') . "forgot-password?token={$token}&email={$user->email}");

        // Send email using your custom helper
        $sent = EmailHelper::send(
            $user->email,
            'Reset Your Password - Everyday CRM',
            'emails.forgot-password', // Blade template
            [
                'url' => $resetUrl,
                'email' => $user->email,
                'expire' => config('auth.passwords.users.expire') / 60 . ' minutes',
            ]
        );

        if (!$sent) {
            return response()->json(['status' => false, 'message' => 'Failed to send reset email. Try again.'], 500);
        }

        return response()->json(['status' => true, 'message' => 'Password reset link sent successfully.']);
    }


    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'token' => 'required',
            'password' => 'required|confirmed|min:6',
        ]);

        $status = Password::broker()->reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                ])->save();
            }
        );

        return $status === Password::PASSWORD_RESET
            ? response()->json(['message' => 'Password reset successfully.'])
            : response()->json(['message' => 'Invalid or expired token.'], 400);
    }


    public function generateRegisterLink(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $email = $request->email;

        // Optional: Check if already registered
        if (User::where('email', $email)->exists()) {
            return response()->json([
                'status' => false,
                'message' => 'User already registered with this email.',
            ], 409);
        }

        // Generate secure token
        $token = Str::uuid(); // or Str::random(40)

        // Cache token temporarily (e.g., 60 minutes or 24 hours)
        Cache::put('register_token_' . $token, $email, now()->addHours(24)); // Adjust as needed

        // Construct frontend link
        $registerUrl = config('app.frontend_url', env('REACT_APP_URL', 'http://localhost:5173')) . "/register?token={$token}";

        return response()->json([
            'status' => true,
            'message' => 'Secure registration link generated.',
            'url' => $registerUrl,
        ]);
    }



    public function verifyRegisterToken($token)
    {
        $invitation = UserInvitation::where('token', $token)
            ->where('used', false)
            ->where('expires_at', '>', now())
            ->first();

        if (!$invitation) {
            return response()->json(['valid' => false, 'message' => 'Token expired or invalid.'], 404);
        }

        return response()->json(['valid' => true, 'data' => $invitation]);
    }


    /***Admin Send invite */
    public function inviteUser(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'email' => 'required|email|unique:users,email',
            'phone' => 'nullable|string|max:15',
            'role_id' => 'required|in:2,3',
        ]);

        $token = Str::uuid();
        $data = $request->only('first_name', 'last_name', 'email', 'phone', 'role_id');

        // Cache data for 48 hours
        Cache::put("register_token_$token", $data, now()->addHours(48));

        // Generate registration URL
        $registerUrl = config('app.frontend_url') . "/register?token=$token";

        // Send email
        EmailHelper::send(
            $data['email'],
            'You’ve been invited to Everyday CRM',
            'emails.invite-user',
            [
                'first_name' => $data['first_name'],
                'register_url' => $registerUrl,
                'expires' => '48 hours',
            ]
        );

        return response()->json(['status' => true, 'message' => 'Invite sent successfully.']);
    }

    public function verifyEmail($token)
    {
        $record = DB::table('email_verification_tokens')
            ->where('token', $token)
            ->where('expires_at', '>', now())
            ->first();

        if (!$record) {
            return response()->json(['message' => 'Token invalid or expired'], 400);
        }

        $user = User::find($record->user_id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user->update([
            'status' => 1,
            'email_verified_at' => now()
        ]);

       // DB::table('email_verification_tokens')->where('token', $token)->delete();

        return response()->json(['message' => 'Email verified successfully']);
    }
}
