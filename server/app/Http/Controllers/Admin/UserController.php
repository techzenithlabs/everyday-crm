<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\UserInvitation;
use App\Models\Menu;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Mail;
use App\Helpers\EmailHelper;

class UserController extends Controller
{
    public function listInvitedUsers(Request $request)
    {
        try {

            $menus = Menu::where('is_active', true)->get();

            $query = UserInvitation::with('role')
                ->select('*')
                ->selectRaw("0 as permission_count"); // Placeholder


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


            $parentMenus = $menus->whereNull('parent_id')->pluck('id')->toArray();
            $childrenGroupedByParent = $menus->whereNotNull('parent_id')
                ->groupBy('parent_id')
                ->map(fn($group) => $group->pluck('id')->toArray());


            $users->getCollection()->transform(function ($user) use ($parentMenus, $childrenGroupedByParent) {
                $permissions = is_array($user->permissions)
                    ? $user->permissions
                    : json_decode($user->permissions, true) ?? [];


                $excludedParents = [];
                foreach ($childrenGroupedByParent as $parentId => $childIds) {
                    if (count(array_intersect($permissions, $childIds)) > 0) {
                        $excludedParents[] = $parentId;
                    }
                }

                $count = collect($permissions)
                    ->reject(fn($id) => in_array($id, $excludedParents))
                    ->count();

                $user->permission_count = $count;
                return $user;
            });

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
        //header('Access-Control-Allow-Origin:*');
        try {
            $validator = Validator::make($request->all(), [
                'email' => 'required|email|unique:user_invitations,email',
                'first_name' => 'required|string|max:100',
                'last_name' => 'required|string|max:100',
                'role_id' => 'required|exists:roles,id',
                'permissions' => 'nullable|array',
                'permissions.*' => 'integer|exists:menus,id', // Assuming permissions are linked to modules
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
                'token' => Str::random(30),
                'expires_at' => now()->addDays(2),
                'permissions' => $request->permissions // JSON column
            ]);

            // Step 2: Send email (optional)
            EmailHelper::send(
                $invitation->email,
                'You’re invited to Everyday CRM!',
                'emails.invite_user',
                [
                    'name' => $invitation->first_name,
                    'register_url' => url('/register/' . $invitation->token),
                ]
            );

            return response()->json([
                'status' => true,
                'message' => 'Invitation sent successfully',
                'data' => $invitation
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
