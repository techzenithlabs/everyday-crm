<?php

namespace App\Http\Controllers\Projects;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Projects\Board;
use Illuminate\Support\Facades\Log;
use Exception;

class BoardController extends Controller
{
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'project_id' => 'required|exists:projects,id',
                'title' => 'required|string|max:255',
            ]);

            $board = Board::create([
                'project_id' => $validated['project_id'],
                'title' => $validated['title'],
                'sort_order' => Board::where('project_id', $validated['project_id'])->max('sort_order') + 1
            ]);

            return response()->json([
                'status' => true,
                'message' => 'Board created successfully.',
                'data' => $board,
            ]);
        } catch (Exception $e) {
            Log::error('Board creation failed: ' . $e->getMessage());
            return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, Board $board)
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
            ]);

            $board->update($validated);

            return response()->json([
                'status' => true,
                'message' => 'Board updated successfully.',
                'data' => $board,
            ]);
        } catch (Exception $e) {
            Log::error('Board update failed: ' . $e->getMessage());
            return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function destroy(Board $board)
    {
        try {
            $board->delete();

            return response()->json([
                'status' => true,
                'message' => 'Board deleted successfully.',
            ]);
        } catch (Exception $e) {
            Log::error('Board deletion failed: ' . $e->getMessage());
            return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }
}
