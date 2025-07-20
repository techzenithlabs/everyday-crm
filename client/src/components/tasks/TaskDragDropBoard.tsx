import React, { useState } from "react";
import {
  DndContext,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDroppable,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";


import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import BoardColumn from "@/components/kanban/BoardColumn";
import SortableTask from "./SortableTask";

import { format, parseISO } from "date-fns";
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

  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const findBoardByTaskId = (taskId: number): Board | undefined =>
    boards.find((board) => board.tasks.some((task) => task.id === taskId));

  const handleDragStart = (event: DragStartEvent) => {
    const [taskIdStr] = String(event.active.id).split("-");
    const taskId = Number(taskIdStr);
    const board = findBoardByTaskId(taskId);
    const task = board?.tasks.find((t) => t.id === taskId) || null;
    setActiveTask(task);
  };

  const handleDragEnd = (event: DragEndEvent): void => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over || active.id === over.id) return;

    const [activeTaskIdStr] = String(active.id).split("-");
    const taskId = Number(activeTaskIdStr);
    const fromBoard = findBoardByTaskId(taskId);
    if (!fromBoard) return;

    const overIdStr = String(over.id);
    let toBoardId: number | null = null;
    let newIndex = 0;

    if (overIdStr.includes("drop:")) {
      const rawId = overIdStr.split("drop:")[1];
      toBoardId = Number(rawId);
      const toBoard = boards.find((b) => b.id === toBoardId);
      if (!toBoard) return;
      newIndex = 0;
    } else if (overIdStr.includes("-")) {
      const [overTaskIdStr, boardIdStr] = overIdStr.split("-");
      toBoardId = Number(boardIdStr);
      const toBoard = boards.find((b) => b.id === toBoardId);
      if (!toBoard) return;

      const overTaskId = Number(overTaskIdStr);
      const overIndex = toBoard.tasks.findIndex((t) => t.id === overTaskId);
      newIndex = overIndex >= 0 ? overIndex : toBoard.tasks.length;
    } else {
      return;
    }

    const toBoard = boards.find((b) => b.id === toBoardId);
    if (!toBoard) return;

    const newStatus =
      toBoard.slug || toBoard.title.toLowerCase().replace(/\s+/g, "_");

    if (
      fromBoard.id !== toBoard.id ||
      newIndex !== fromBoard.tasks.findIndex((t) => t.id === taskId)
    ) {
      onTaskMove(taskId, fromBoard.id, toBoard.id, newStatus, newIndex);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto">
        {boards.map((board) => (
          <DroppableBoardColumn
            key={board.id}
            board={board}
            onAddTask={onAddTask}
            onEditTask={onEditTask}
            onViewTask={onViewTask}
          />
        ))}
      </div>

      <DragOverlay dropAnimation={{ duration: 200, easing: "ease-in-out" }}>
        {activeTask ? (
          <div className="p-3 w-[260px] rounded-lg border shadow-xl bg-white scale-105">
            <div className="flex justify-between items-start mb-1">
              <h4 className="text-sm font-semibold">{activeTask.title}</h4>
              <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                {activeTask.status}
              </span>
            </div>

            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
              {activeTask.description}
            </p>

            <div className="flex justify-between items-center mt-2 text-xs text-gray-600">
              <span>
                Due:{" "}
                {activeTask.due_date
                  ? format(parseISO(activeTask.due_date), "dd MMM yyyy")
                  : "N/A"}
              </span>
              <span
                className={`px-2 py-0.5 rounded ${
                  activeTask.priority === "High"
                    ? "bg-red-100 text-red-700"
                    : activeTask.priority === "Medium"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {activeTask.priority}
              </span>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default TaskDragDropBoard;

const DroppableBoardColumn: React.FC<{
  board: Board;
  onAddTask: (boardId: number) => void;
  onEditTask: (task: Task, boardId: number) => void;
  onViewTask: (task: Task) => void;
}> = ({ board, onAddTask, onEditTask, onViewTask }) => {
  const { setNodeRef } = useDroppable({
    id: `drop:${board.id}`,
  });

  return (
    <div className="min-w-[300px]" ref={setNodeRef}>
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
  );
};
