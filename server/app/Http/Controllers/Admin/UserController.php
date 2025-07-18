<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Menus\Menu;
use App\Models\Users\User;
Use App\Models\Users\UserInfo;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    public function listUsers(Request $request)
    {
        try {
            $menus = Menu::where('is_active', true)->get();

            $query = User::with(['role', 'userPermissions', 'userInfo'])
                ->where('role_id', '!=', 1)
                ->select('*');

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

            // Transform to calculate permission count from user_permissions table
            $users->getCollection()->transform(function ($user) use ($childrenGroupedByParent) {
               $permissions = $user->userPermissions?->permissions ?? [];

                $flatIds = collect($permissions)->flatMap(function ($children, $parent) {
                    $children = is_array($children) ? $children : [$children];
                    return array_merge([$parent], $children);
                })->unique()->values()->toArray();

                $excludedParents = [];
                foreach ($childrenGroupedByParent as $parentId => $childIds) {
                    if (count(array_intersect($flatIds, $childIds)) > 0) {
                        $excludedParents[] = $parentId;
                    }
                }

                $finalCount = collect($flatIds)
                    ->reject(fn($id) => in_array($id, $excludedParents))
                    ->count();

                $user->permission_count = $finalCount;
                return $user;
            });

            return response()->json([
                'status' => true,
                'message' => 'Users fetched successfully',
                'data' => $users
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Error fetching users',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function updateUser(Request $request, $id)
    {
        try {
            $validator = Validator::make($request->all(), [
                'first_name'   => 'required|string|max:100',
                'last_name'    => 'required|string|max:100',
                'email'        => 'required|email|unique:users,email,' . $id,
                'status'       => 'required|in:0,1',
                'phone'        => 'nullable|string|max:20',
                'address'      => 'nullable|string|max:255',
                'city'         => 'nullable|string|max:100',
                'state'        => 'nullable|string|max:100',
                'postal_code'  => 'nullable|string|max:20',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            $user = User::findOrFail($id);

            // Update users table
            $user->update([
                'first_name' => $request->first_name,
                'last_name'  => $request->last_name,
                'email'      => $request->email,
                'status'     => $request->status,
            ]);

            // Update or create user_infos table
            UserInfo::updateOrCreate(
                ['user_id' => $id],
                [
                    'phone'        => $request->phone,
                    'address'      => $request->address,
                    'city'         => $request->city,
                    'state'        => $request->state,
                    'postal_code'  => $request->postal_code,
                ]
            );

            return response()->json([
                'status' => true,
                'message' => 'User updated successfully',
                'user' => $user->load('info') // if you have relation defined
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Server Error: ' . $e->getMessage(),
            ], 500);
        }
    }
}
