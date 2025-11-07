<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $tasks = Task::query();

        // filter by status
        if ($request->has('status') && in_array($request->status, ['todo', 'progress', 'done'])) {
            $tasks->where('status', $request->status);
        }

        // sorting by deadline
        if ($request->has('deadline')) {
            switch ($request->deadline) {
                case 'asc':
                    $tasks->orderBy('deadline', 'asc');
                    break;
                case 'desc':
                    $tasks->orderBy('deadline', 'desc');
                    break;
                default:
                    $tasks->latest(); // default sort by created_at desc
                    break;
            }
        } else {
            $tasks->latest(); // default: created_at DESC
        }

        // get tasks
        $tasks = $tasks->get();

        return response()->json([
            'message' => 'Tasks retrieved successfully',
            'tasks' => $tasks
        ], 200);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'user_id' => 'required|exists:users,id',
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'status' => 'in:todo,progress,done',
                'deadline' => 'nullable|date',
                'created_by' => 'required|exists:users,id',
            ]);

            $task = Task::create($validated);

            return response()->json([
                'message' => 'Task created successfully',
                'task' => $task
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Task creation failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Task $task)
    {
        return response()->json([
            'message' => 'Task retrieved successfully',
            'task' => $task
        ], 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Task $task)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Task $task)
    {
        try {
            $validated = $request->validate([
                'user_id' => 'sometimes|required|exists:users,id',
                'title' => 'sometimes|required|string|max:255',
                'description' => 'nullable|string',
                'status' => 'sometimes|required|in:todo,progress,done',
                'deadline' => 'nullable|date',
                'created_by' => 'sometimes|required|exists:users,id',
            ]);

            $task->update($validated);

            return response()->json([
                'message' => 'Task updated successfully',
                'task' => $task
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Task update failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        try {
            $task->delete();
            return response()->json([
                'message' => 'Task deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Task deletion failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
