import type { Task } from "@/types/task";
import type { Board } from "@/types/board";
import TaskCard from "./TaskCard";

interface BoardColumnProps {
  board: Board;
  onAddTask: (boardId: number) => void;
  onEditTask?: (task: Task, boardId: number) => void;
  onViewTask?: (task: Task) => void;
  children?: React.ReactNode; // ✅ Needed for SortableContext
}

const BoardColumn = ({
  board,
  onAddTask,
  onEditTask,
  onViewTask,
  children,
}: BoardColumnProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 w-64 min-w-[16rem]">
      {/* Board Header */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-lg">
          {board?.title || "Unnamed Board"}
        </h3>

        <button
          onClick={() => onAddTask(board.id)}
          className="text-blue-600 text-sm hover:underline"
        >
          + New Task
        </button>
      </div>

      {/* Task List - Drag-and-drop support */}
      <div className="space-y-2">
        {children ?? (
          <>
            {board.tasks.length > 0 ? (
              board.tasks.map((task, index) => (
                <TaskCard
                  key={index}
                  task={task}
                  onEdit={() => onEditTask?.(task, board.id)}
                  onView={() => onViewTask?.(task)}
                />
              ))
            ) : (
              <p className="text-gray-400 text-sm">No tasks</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BoardColumn;
