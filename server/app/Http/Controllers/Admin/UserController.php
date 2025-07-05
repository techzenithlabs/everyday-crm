<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Users\UserInvitation;
use App\Models\Menus\Menu;
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
                ->selectRaw("0 as permission_count");

            // Search
            if ($request->filled('search')) {
                $search = $request->input('search');
                $query->where(function ($q) use ($search) {
                    $q->where('first_name', 'like', "%$search%")
                        ->orWhere('last_name', 'like', "%$search%")
                        ->orWhere('email', 'like', "%$search%");
                });
            }

            // Sorting
            $sortBy = $request->input('sort_by', 'created_at');
            $sortOrder = $request->input('sort_order', 'desc');
            $allowedSortFields = ['first_name', 'last_name', 'email', 'created_at', 'expires_at'];
            if (!in_array($sortBy, $allowedSortFields)) {
                $sortBy = 'created_at';
            }
            $query->orderBy($sortBy, $sortOrder);

            // Pagination
            $perPage = $request->input('per_page', 10);
            $users = $query->paginate($perPage);

            // Group child menus by parent_id
            $childrenGroupedByParent = $menus
                ->whereNotNull('parent_id')
                ->groupBy('parent_id')
                ->map(function ($group) {
                    return $group->pluck('id')->toArray();
                });

            // Transform to calculate accurate permission count
            $users->getCollection()->transform(function ($user) use ($childrenGroupedByParent) {
                $permissions = is_array($user->permissions)
                    ? $user->permissions
                    : json_decode($user->permissions, true) ?? [];

                // Flatten to get only selected menu IDs
                $flatIds = collect($permissions)->flatMap(function ($value, $key) {
                    $children = is_array($value) ? $value : [$value];
                    return array_merge([$key], $children);
                })->unique()->values()->toArray();

                // Exclude parent if its children are present
                $excludedParents = [];
                foreach ($childrenGroupedByParent as $parentId => $childIds) {
                    if (count(array_intersect($flatIds, $childIds)) > 0) {
                        $excludedParents[] = $parentId;
                    }
                }

                // Count without excluded parents
                $finalCount = collect($flatIds)
                    ->reject(fn($id) => in_array($id, $excludedParents))
                    ->count();

                $user->permission_count = $finalCount;
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

            // Step 1: Create invitation entry
            $invitation = UserInvitation::create([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'email' => $request->email,
                'role_id' => $request->role_id,
                'token' => Str::random(30),
                'expires_at' => now()->addDays(2),
                'permissions' => $grouped,
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
