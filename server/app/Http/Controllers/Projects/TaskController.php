<?php

namespace App\Http\Controllers\Projects;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Projects\Task;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    public function index($boardId)
    {
        try {
           $tasks = Task::with(['assignee:id,first_name,last_name'])
                ->where('board_id', $boardId)
                ->orderBy('sort_order')
                ->get();


            return response()->json([
                'status' => true,
                'data' => $tasks
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to load tasks'
            ], 500);
        }
    }

    public function store(Request $request, $boardId)
    {
        try {
            $validator = Validator::make($request->all(), [
                'title' => 'required|string|max:255',
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
                    'message' => $validator->errors()->first()
                ], 200); // ✅ still status 200, but status: false
            }

            $maxPosition = Task::where('board_id', $boardId)->max('position');

            $task = Task::create([
                'board_id' => $boardId,
                'title' => $request->title,
                'description' => $request->description,
                'due_date' => $request->due_date,
                'priority' => $request->priority,
                'labels' => $request->labels ?? [],
                'assigned_to' => $request->assigned_to,
                'status' => 'todo',
                'sort_order' => 0,
                'position' => is_null($maxPosition) ? 0 : $maxPosition + 1,
                'created_by' => Auth::id(),
            ]);

            return response()->json([
                'status' => true,
                'message' => 'Task created successfully',
                'data' => $task
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage() ?: 'Failed to create task'
            ], 500); // ✅ Only real server error
        }
    }

    public function update(Request $request, $taskId)
    {
        header("Access-Control-Allow-Origin: *");
        dd($request->all());
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
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to update task'
            ], 500);
        }
    }

    public function destroy($taskId)
    {
        try {
            $task = Task::findOrFail($taskId);
            $task->delete();

            return response()->json([
                'status' => true,
                'message' => 'Task deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to delete task'
            ], 500);
        }
    }


    public function move(Request $request, $taskId)
    {
        try {
            $task = Task::findOrFail($taskId);

            $validator = Validator::make($request->all(), [
                'from_board_id' => 'required|exists:boards,id',
                'to_board_id' => 'required|exists:boards,id',
                'position' => 'required|integer|min:0',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'message' => $validator->errors()->first()
                ], 200);
            }

            $task->update([
                'board_id' => $request->to_board_id,
                'position' => $request->position
            ]);

            return response()->json([
                'status' => true,
                'message' => 'Task moved successfully',
                'data' => $task
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to move task',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
