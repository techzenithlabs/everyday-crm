<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Menus\Menu;
use App\Models\Users\User;

class UserController extends Controller
{
    public function listUsers(Request $request)
    {
        try {
            $menus = Menu::where('is_active', true)->get();

            $query = User::with(['role', 'userPermissions'])
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
}
