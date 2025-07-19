<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Projects\Board;
use App\Models\Projects\Task;

class TaskPositionSeeder extends Seeder
{
    public function run(): void
    {
        $boards = Board::with(['tasks' => function ($query) {
            $query->orderBy('id'); // Or order by created_at if needed
        }])->get();

        foreach ($boards as $board) {
            foreach ($board->tasks as $index => $task) {
                $task->position = $index;
                $task->save();
            }
        }

        echo "✅ Task positions seeded successfully.\n";
    }
}
