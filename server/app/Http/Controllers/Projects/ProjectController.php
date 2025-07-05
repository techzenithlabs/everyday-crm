<?php

namespace App\Http\Controllers\Projects;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Projects\Project;
use Illuminate\Support\Facades\Log;
use Exception;

class ProjectController extends Controller
{
    public function index()
    {
        try {
            $projects = Project::with('boards.tasks')
                ->where('created_by', auth()->id())
                ->get();

            return response()->json([
                'status' => true,
                'message' => 'Projects fetched successfully.',
                'data' => $projects,
            ]);
        } catch (Exception $e) {
            Log::error('Project fetch failed: ' . $e->getMessage());

            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
            ]);

            $project = Project::create([
                'title' => $validated['title'],
                'description' => $validated['description'] ?? null,
                'created_by' => auth()->id(),
            ]);

            return response()->json([
                'status' => true,
                'message' => 'Project created successfully.',
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
            // Optionally add policies here: $this->authorize('update', $project);

            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
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
            // Optionally add policies here: $this->authorize('delete', $project);

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
