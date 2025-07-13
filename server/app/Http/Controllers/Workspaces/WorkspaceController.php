<?php

namespace App\Http\Controllers\Workspaces;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Workspaces\Workspace;
use Illuminate\Support\Facades\Log;

class WorkspaceController extends Controller
{
    public function __construct() {}

    public function index()
    {
        try {
            $user = Auth::user();
            return response()->json([
                'status' => true,
                'data' => $user->workspaces,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to fetch workspaces: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Something went wrong while fetching workspaces.',
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
            ]);

            $user = Auth::user();

            if ($user->workspaces()->exists()) {
                return response()->json([
                    'status' => false,
                    'message' => 'You already have a workspace.',
                ], 403);
            }

            $workspace = Workspace::create([
                'name' => $request->name,
                'created_by' => $user->id,   // ✅ REQUIRED
                'is_active' => true          // ✅
            ]);

            $user->workspaces()->attach($workspace->id, ['role' => 'owner']);

            return response()->json([
                'status' => true,
                'data' => $workspace,
                'message' => 'Workspace created successfully.',
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to create workspace: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, Workspace $workspace)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
            ]);

            $workspace->update(['name' => $request->name]);

            return response()->json([
                'status' => true,
                'message' => 'Workspace renamed successfully',
                'data' => $workspace,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to update workspace: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Failed to update workspace.',
            ], 500);
        }
    }

    public function destroy(Workspace $workspace)
    {
        try {
            $workspace->delete(); // Requires SoftDeletes trait
            return response()->json([
                'status' => true,
                'message' => 'Workspace deleted successfully.',
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to delete workspace: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Failed to delete workspace.',
            ], 500);
        }
    }
}
