import React from "react";
import {
  DndContext,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import BoardColumn from "@/components/kanban/BoardColumn";
import SortableTask from "./SortableTask";

import type { Task } from "@/types/task";
import type { Board } from "@/types/board";

interface Props {
  boards: Board[];
  onTaskMove: (
    taskId: number,
    fromBoardId: number,
    toBoardId: number,
    newStatus: string,
    newIndex: number
  ) => void;
  onEditTask: (task: Task, boardId: number) => void;
  onViewTask: (task: Task) => void;
  onAddTask: (boardId: number) => void;
}

const TaskDragDropBoard: React.FC<Props> = ({
  boards,
  onTaskMove,
  onEditTask,
  onViewTask,
  onAddTask,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const findBoardByTaskId = (taskId: number): Board | undefined =>
    boards.find((board) => board.tasks.some((task) => task.id === taskId));

  const handleDragEnd = (event: DragEndEvent): void => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const [activeTaskIdStr] = String(active.id).split("-");
    const [overTaskIdStr, overBoardIdStr] = String(over.id).split("-");

    const taskId = Number(activeTaskIdStr);
    const overTaskId = Number(overTaskIdStr);
    const toBoardId = Number(overBoardIdStr);

    const fromBoard = findBoardByTaskId(taskId);
    const toBoard = boards.find((b) => b.id === toBoardId);

    if (!fromBoard || !toBoard) return;

    // Find new index (position) in the target board
    const overIndex = toBoard.tasks.findIndex((t) => t.id === overTaskId);
    const newIndex = overIndex >= 0 ? overIndex : toBoard.tasks.length;

    const newStatus = toBoard.slug || toBoard.title.toLowerCase().replace(/\s+/g, "_");

    onTaskMove(taskId, fromBoard.id, toBoard.id, newStatus, newIndex);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto">
        {boards.map((board) => (
          <div key={board.id} className="min-w-[300px]">
            <BoardColumn board={board} onAddTask={onAddTask}>
              <SortableContext
                items={board.tasks.map((t) => `${t.id}-${board.id}`)}
                strategy={verticalListSortingStrategy}
              >
                {board.tasks.map((task) => (
                  <SortableTask
                    key={`${task.id}-${board.id}`}
                    id={`${task.id}-${board.id}`}
                    task={task}
                    boardId={board.id}
                    onEditTask={onEditTask}
                    onViewTask={onViewTask}
                  />
                ))}
              </SortableContext>
            </BoardColumn>
          </div>
        ))}
      </div>
    </DndContext>
  );
};

export default TaskDragDropBoard;
