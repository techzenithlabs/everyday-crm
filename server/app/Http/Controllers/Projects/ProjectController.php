<?php

namespace App\Http\Controllers\Projects;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Projects\Project;
use App\Models\Projects\Board;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Config;
use App\Models\Projects\BoardType;
use Exception;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Project::with(['workspace', 'boards.tasks'])
                ->where('created_by', Auth::id());

            // ✅ Optional filter by workspace
            if ($request->has('workspace_id')) {
                $query->where('workspace_id', $request->workspace_id);
            }

            $projects = $query->get();

            return response()->json([
                'status' => true,
                'message' => 'Projects fetched successfully.',
                'data' => $projects,
            ]);
        } catch (Exception $e) {
            \Log::error('Project fetch failed: ' . $e->getMessage());

            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function show($id)
    {
        $project = Project::with([
            'boards' => function ($query) {
                $query->orderBy('sort_order'); // Optional for board ordering
            },
            'boards.tasks' => function ($query) {
                $query->orderBy('position'); // Ensure task order
            },
            'boards.boardType'
        ])->find($id);

        if (!$project) {
            return response()->json([
                'status' => false,
                'message' => 'Project not found',
            ], 404);
        }

        return response()->json([
            'status' => true,
            'data' => $project,
        ]);
    }


    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'workspace_id' => 'required|exists:workspaces,id',
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
            ]);

            $project = Project::create([
                'workspace_id' => $validated['workspace_id'],
                'title' => $validated['title'],
                'description' => $validated['description'] ?? null,
                'created_by' => Auth::id(),
                'status' => Project::STATUS_ACTIVE,
            ]);

            // Auto-create default boards
            //$defaultBoards = Config::get('boards.default_board_types');
            $defaultBoardTypes = BoardType::orderBy('sort_order')->get();
            foreach ($defaultBoardTypes as $type) {
                Board::create([
                    'project_id'     => $project->id,
                    'title'           => $type->name,
                    'slug'           => $type->slug,
                    'sort_order'     => $type->sort_order,
                    'board_type_id'  => $type->id, // if you added this column
                ]);
            }

            return response()->json([
                'status' => true,
                'message' => 'Project created successfully with default boards.',
                'data' => $project,
            ]);
        } catch (Exception $e) {
            Log::error('Project creation failed: ' . $e->getMessage());

            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, Project $project)
    {
        try {
            // Optional: Authorize that user owns the project

            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                // ❌ No workspace_id here — don’t allow changing workspace from update
            ]);

            $project->update($validated);

            return response()->json([
                'status' => true,
                'message' => 'Project updated successfully.',
                'data' => $project,
            ]);
        } catch (Exception $e) {
            Log::error('Project update failed: ' . $e->getMessage());

            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy(Project $project)
    {
        try {
            // Optional: Authorize that user owns the project

            $project->delete();

            return response()->json([
                'status' => true,
                'message' => 'Project deleted successfully.',
            ]);
        } catch (Exception $e) {
            Log::error('Project deletion failed: ' . $e->getMessage());

            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
