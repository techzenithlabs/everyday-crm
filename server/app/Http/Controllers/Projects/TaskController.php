<?php

namespace App\Http\Controllers\Projects;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Projects\Task;
use Illuminate\Support\Facades\Log;
use Exception;

class TaskController extends Controller
{
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'board_id' => 'required|exists:boards,id',
                'title' => 'required|string|max:255',
            ]);

            $task = Task::create([
                'board_id' => $validated['board_id'],
                'title' => $validated['title'],
                'sort_order' => Task::where('board_id', $validated['board_id'])->max('sort_order') + 1,
            ]);

            return response()->json([
                'status' => true,
                'message' => 'Task created successfully.',
                'data' => $task,
            ]);
        } catch (Exception $e) {
            Log::error('Task creation failed: ' . $e->getMessage());
            return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, Task $task)
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
            ]);

            $task->update($validated);

            return response()->json([
                'status' => true,
                'message' => 'Task updated successfully.',
                'data' => $task,
            ]);
        } catch (Exception $e) {
            Log::error('Task update failed: ' . $e->getMessage());
            return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function destroy(Task $task)
    {
        try {
            $task->delete();

            return response()->json([
                'status' => true,
                'message' => 'Task deleted successfully.',
            ]);
        } catch (Exception $e) {
            Log::error('Task deletion failed: ' . $e->getMessage());
            return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }
}
