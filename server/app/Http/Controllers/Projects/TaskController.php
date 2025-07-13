<?php

namespace App\Http\Controllers\Projects;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Projects\Task;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    // ✅ List tasks for a board
    public function index($boardId)
    {
        try {
            $tasks = Task::where('board_id', $boardId)->orderBy('sort_order')->get();

            return response()->json([
                'status' => true,
                'data' => $tasks
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to load tasks',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // ✅ Create task
    public function store(Request $request, $boardId)
    {
        try {
            $validator = Validator::make($request->all(), [
                'title' => 'required|string|max:255',
                // Don't validate board_id from request
                'description' => 'nullable|string',
                'due_date' => 'nullable|date',
                'priority' => 'required|in:Low,Medium,High',
                'labels' => 'nullable|array',
                'labels.*' => 'string',
                'assigned_to' => 'nullable|exists:users,id',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'errors' => $validator->errors(),
                ], 422);
            }

            $task = Task::create([
                'board_id' => $boardId, // ✅ taken from route param, not request
                'title' => $request->title,
                'description' => $request->description,
                'due_date' => $request->due_date,
                'priority' => $request->priority,
                'labels' => $request->labels ?? [],
                'assigned_to' => $request->assigned_to,
                'status' => 'pending',
                'sort_order' => 0,
                'created_by' => auth()->id(),
            ]);

            return response()->json([
                'status' => true,
                'data' => $task
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => 'Task creation failed',
                'error' => $th->getMessage(),
            ], 500);
        }
    }


    // ✅ Update task
    public function update(Request $request, $taskId)
    {

        try {
            $task = Task::findOrFail($taskId);

            $task->update($request->only([
                'title',
                'description',
                'due_date',
                'priority',
                'labels',
                'assigned_to',
                'status'
            ]));

            return response()->json([
                'status' => true,
                'message' => 'Task updated successfully',
                'data' => $task
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to update task',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // ✅ Delete task
    public function destroy($taskId)
    {
        try {
            $task = Task::findOrFail($taskId);
            $task->delete();

            return response()->json([
                'status' => true,
                'message' => 'Task deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to delete task',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
