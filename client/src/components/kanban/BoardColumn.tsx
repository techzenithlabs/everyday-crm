import type { Task } from "@/types/task";
import type { Board } from "@/types/board";
import TaskCard from "./TaskCard";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

interface BoardColumnProps {
  board: Board;
  onAddTask: (boardId: number) => void;
  onEditTask?: (task: Task, boardId: number) => void;
  onViewTask?: (task: Task) => void;
  children?: React.ReactNode;
}

const BoardColumn = ({
  board,
  onAddTask,
  onEditTask,
  onViewTask,
  children,
}: BoardColumnProps) => {
  const { setNodeRef } = useDroppable({
    id: `drop:${board.id}`, // Used to identify drop zone (must match logic in DndContext)
  });

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

      {/* Droppable Task List */}
      <div ref={setNodeRef} className="space-y-2 min-h-[50px]">
        <SortableContext
          items={board.tasks.map((task) => `${task.id}:${board.id}`)}
          strategy={verticalListSortingStrategy}
        >
          {children ?? (
            <>
              {board.tasks.length > 0 ? (
                board.tasks.map((task) => (
                  <TaskCard
                    key={task.id}
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
        </SortableContext>
      </div>
    </div>
  );
};

export default BoardColumn;
