import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";

import { getProjectById } from "@/services/projectService";
import { moveTask } from "@/services/taskService";
import type { Project } from "@/types/project";
import type { Task } from "@/types/task";
import type { Board } from "@/types/board";

import StatusBoard from "@/components/kanban/StatusBoard";
import SortableTask from "@/components/tasks/SortableTask";
import { showErrorToast } from "@/utils/toastHelpers";

const PermitsBoard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const fetchProject = useCallback(async () => {
    try {
      if (!id) return;
      const data = await getProjectById(Number(id));
      setProject(data);
      const permitsBoard = data.boards.find(
        (b: Board) =>
          b.slug === "permits" || b.title.toLowerCase().includes("permit")
      );
      if (permitsBoard) {
        const boardTasks = permitsBoard.tasks || [];
        setTasks(boardTasks);
      } else {
        showErrorToast("Permits board not found in this project.");
      }
    } catch {
      showErrorToast("Failed to load project");
    }
  }, [id]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  const handleTaskMove = async (
    taskId: number,
    fromStatus: string,
    toStatus: string,
    newIndex: number
  ) => {
    try {
      if (!project) return;
      const board = project.boards.find(
        (b: Board) =>
          b.slug === "permits" || b.title.toLowerCase().includes("permit")
      );
      if (!board) return;

      await moveTask(taskId, board.id, board.id, toStatus, newIndex);
      fetchProject();
    } catch {
      showErrorToast("Failed to move task");
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const [taskIdStr] = String(event.active.id).split("-");
    const taskId = Number(taskIdStr);
    const task = tasks.find((t) => t.id === taskId) || null;
    setActiveTask(task);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over || active.id === over.id) return;

    const [taskIdStr, fromStatusRaw] = String(active.id).split("-");
    const [, toStatusRaw] = String(over.id).split("-");

    const taskId = Number(taskIdStr);
    const fromStatus = fromStatusRaw.replace(/_/g, " ");
    const toStatus = toStatusRaw.replace(/_/g, " ");

    const toTasks = tasks.filter((t) => t.status === toStatus);
    const overIndex = toTasks.findIndex(
      (t) => `${t.id}-${toStatusRaw}` === over.id
    );
    const newIndex = overIndex >= 0 ? overIndex : toTasks.length;

    const currentIndex = tasks.findIndex((t) => t.id === taskId);

    if (fromStatus !== toStatus || currentIndex !== newIndex) {
      handleTaskMove(taskId, fromStatus, toStatus, newIndex);
    }
  };

  const handleEditTask = (task: Task) => {
    console.log("Edit Task:", task);
  };

  const handleViewTask = (task: Task) => {
    console.log("View Task:", task);
  };

  if (!project) return null;

  const permitsBoardId =
    project.boards.find(
      (b: Board) =>
        b.slug === "permits" || b.title.toLowerCase().includes("permit")
    )?.id ?? 0;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Permits Board</h2>
        <StatusBoard
          tasks={tasks}
          setTasks={setTasks} // ✅ Add this line
          boardId={permitsBoardId}
          onTaskMove={handleTaskMove}
          onEditTask={handleEditTask}
          onViewTask={handleViewTask}
        />
      </div>

      <DragOverlay>
        {activeTask && (
          <SortableTask
            id={`${activeTask.id}-${(activeTask.status ?? "To Do").replace(
              /\s/g,
              "_"
            )}`}
            task={activeTask}
            boardId={activeTask.board_id}
            onEditTask={handleEditTask}
            onViewTask={handleViewTask}
          />
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default PermitsBoard;
