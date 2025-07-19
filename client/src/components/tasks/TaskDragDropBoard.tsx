import React from "react";
import {
  DndContext,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors  
} from "@dnd-kit/core";

import type { DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
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
      activationConstraint: {
        distance: 8, // Prevents accidental drag on click
      },
    })
  );

  const findBoardIdByTaskId = (taskId: number): number | null => {
    const board = boards.find((b) => b.tasks.some((t) => t.id === taskId));
    return board?.id ?? null;
  };

  const handleDragEnd = (event: DragEndEvent): void => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const fromBoardId = findBoardIdByTaskId(Number(active.id));
    const toBoardId = findBoardIdByTaskId(Number(over.id));
    if (!fromBoardId || !toBoardId) return;

    const fromBoard = boards.find((b) => b.id === fromBoardId);
    const toBoard = boards.find((b) => b.id === toBoardId);
    if (!fromBoard || !toBoard) return;

    const fromIndex = fromBoard.tasks.findIndex((task) => task.id === Number(active.id));
    const toIndex = toBoard.tasks.findIndex((task) => task.id === Number(over.id));

    // UI reordering for same board
    if (fromBoardId === toBoardId) {
      const updatedTasks = arrayMove(fromBoard.tasks, fromIndex, toIndex);
      fromBoard.tasks = updatedTasks;
    }

    // Backend update
    onTaskMove(Number(active.id), fromBoardId, toBoardId, toIndex);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4">
        {boards.map((board) => (
          <div key={board.id}>
            <BoardColumn board={board} onAddTask={onAddTask}>
              <SortableContext
                items={board.tasks.map((t) => t.id)}
                strategy={verticalListSortingStrategy}
              >
                {board.tasks.map((task) => (
                  <SortableTask
                    key={task.id}
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
