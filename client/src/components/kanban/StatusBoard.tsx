import React, { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  type DragEndEvent,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import SortableTask from "@/components/tasks/SortableTask";
import type { Task } from "@/types/task";
import { moveTaskWithinBoard } from "@/services/taskService";
import { statusLabels } from "@/utils/statusLabels";
import {showErrorToast } from "@/utils/toastHelpers";
import { showSuccess } from "@/utils/ConfirmDialogHelpers";

interface Props {
  boardId: number;
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  onEditTask: (task: Task, boardId: number) => void;
  onViewTask: (task: Task) => void;
}

const statuses = ["todo", "in_progress", "completed"];

// ✅ Map frontend-friendly statuses to backend values
const mapFrontendToBackendStatus = (status: string): string => {
  if (status === "done") return "completed";
  return status;
};

const StatusBoard: React.FC<Props> = ({
  boardId,
  tasks,
  setTasks,
  onEditTask,
  onViewTask,
}) => {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const [taskIdStr] = String(event.active.id).split("-");
    const task = tasks.find((t) => t.id === Number(taskIdStr));
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over || active.id === over.id) {
      console.log("❌ No valid drop target or dropped on self");
      return;
    }

    const [activeTaskIdStr] = String(active.id).split("-");
    const [targetBoardIdStr, targetStatus] = String(over.id).split("-");

    const activeTaskId = Number(activeTaskIdStr);
    const targetBoardId = Number(targetBoardIdStr);
    const backendTargetStatus = mapFrontendToBackendStatus(targetStatus);

    const task = tasks.find((t) => t.id === activeTaskId);
    if (!task) {
      console.log("❌ Task not found");
      return;
    }

    const isSameBoard = task.board_id === targetBoardId;
    const isStatusChanged = task.status !== backendTargetStatus;

    // ❌ Block To Do → Completed directly
    if (task.status === "todo" && backendTargetStatus === "completed") {
      showErrorToast("Sorry, you can't move directly from To Do to Done.");
      return;
    }

    const tasksForTargetStatus = tasks.filter(
      (t) => t.board_id === targetBoardId && t.status === backendTargetStatus
    );
    const newPosition = tasksForTargetStatus.length;

    if (isSameBoard && isStatusChanged) {
      try {
        await moveTaskWithinBoard(
          activeTaskId,
          targetBoardId,
          backendTargetStatus,
          newPosition
        );
        console.log("✅ moveTaskWithinBoard API called");

        const updatedTasks = tasks.map((t) =>
          t.id === activeTaskId
            ? { ...t, status: backendTargetStatus, position: newPosition }
            : t
        );
        setTasks(updatedTasks as Task[]);

        showSuccess(
          "Task Moved",
          `Task moved to ${statusLabels[backendTargetStatus] || backendTargetStatus}`
        );
      } catch {
     
        showErrorToast("Failed to move task.");
      }
    } else {
      console.log("Conditions not met. API not triggered.");
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
        {statuses.map((status) => {
          const columnTasks = tasks.filter(
            (task) => task.board_id === boardId && task.status === status
          );

          return (
            <DroppableColumn
              key={status}
              boardId={boardId}
              status={status}
              label={statusLabels[status] || status}
              tasks={columnTasks}
              onEditTask={onEditTask}
              onViewTask={onViewTask}
            />
          );
        })}
      </div>

      <DragOverlay>
        {activeTask && (
          <SortableTask
            id={`${activeTask.id}-${activeTask.status}`}
            task={activeTask}
            boardId={activeTask.board_id}
            onEditTask={onEditTask}
            onViewTask={onViewTask}
          />
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default StatusBoard;

// ✅ Column Component
interface DroppableColumnProps {
  boardId: number;
  status: string;
  label: string;
  tasks: Task[];
  onEditTask: (task: Task, boardId: number) => void;
  onViewTask: (task: Task) => void;
}

const DroppableColumn: React.FC<DroppableColumnProps> = ({
  boardId,
  status,
  label,
  tasks,
  onEditTask,
  onViewTask,
}) => {
  const { setNodeRef } = useDroppable({ id: `${boardId}-${status}` });

  return (
    <div className="min-w-[300px] bg-gradient-to-br from-white via-[#f9fafb] to-white rounded-2xl shadow-lg p-4 flex flex-col border border-gray-100 hover:shadow-xl transition-shadow duration-200">
      <h4 className="text-md font-bold mb-4 text-gray-800 tracking-wide">{label}</h4>

      <SortableContext
        items={tasks.map((task) => `${task.id}-${status}`)}
        strategy={verticalListSortingStrategy}
      >
        <div
          ref={setNodeRef}
          id={`${boardId}-${status}`}
          className="flex flex-col gap-3 min-h-[100px]"
        >
          {tasks.map((task) => (
            <SortableTask
              key={task.id}
              id={`${task.id}-${status}`}
              task={task}
              boardId={boardId}
              onEditTask={onEditTask}
              onViewTask={onViewTask}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
};
