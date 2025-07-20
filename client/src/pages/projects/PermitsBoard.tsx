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
import { moveTask, updateTask } from "@/services/taskService";

import StatusBoard from "@/components/kanban/StatusBoard";
import SortableTask from "@/components/tasks/SortableTask";
import TaskModal from "@/components/kanban/TaskModal";

import { showErrorToast } from "@/utils/toastHelpers";
import { showSuccess, showError } from "@/utils/ConfirmDialogHelpers";

import type { Project } from "@/types/project";
import type { Task } from "@/types/task";
import type { Board } from "@/types/board";
import type { User } from "@/types/user";

// ✅ Extend Project to include users
interface ProjectWithUsers extends Project {
  users: User[];
}

const PermitsBoard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<ProjectWithUsers | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Partial<Task> | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const fetchProject = useCallback(async () => {
    try {
      if (!id) return;
      const data = await getProjectById(Number(id));
      setProject(data as ProjectWithUsers);

      const permitsBoard = data.boards.find(
        (b: Board) =>
          b.slug === "permits" || b.title.toLowerCase().includes("permit")
      );

      if (permitsBoard) {
        setTasks(permitsBoard.tasks ?? []);
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
  //  fromStatus: string,
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

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setEditModalOpen(true);
  };

  const handleViewTask = (task: Task) => {
    setSelectedTask(task);
    setEditModalOpen(true);
  };

  const handleSaveTask = async (updatedData: Partial<Task>) => {
    if (!updatedData.id) return;

    try {
      const response = await updateTask(updatedData.id, updatedData);
      const updated = response.data;

      if (!updated) {
        showError("No updated task returned from server");
        return;
      }

      setTasks((prev) =>
        prev.map((t) => (t.id === updated.id ? { ...t, ...updated } : t))
      );

      showSuccess("Task updated successfully");
    } catch {
      showError("Failed to update task");
    }
  };

  const permitsBoardId =
    project?.boards.find(
      (b: Board) =>
        b.slug === "permits" || b.title.toLowerCase().includes("permit")
    )?.id ?? 0;

  if (!project) return null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={(event: DragStartEvent) => {
        const [taskIdStr] = String(event.active.id).split("-");
        const task = tasks.find((t) => t.id === Number(taskIdStr)) || null;
        setActiveTask(task);
      }}
      onDragEnd={(event: DragEndEvent) => {
        setActiveTask(null);

        const { active, over } = event;
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
         handleTaskMove(taskId, toStatus, newIndex); 
        }
      }}
    >
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Permits Board</h2>

        <StatusBoard
          tasks={tasks}
          setTasks={setTasks}
          boardId={permitsBoardId}         
          onEditTask={handleEditTask}
          onViewTask={handleViewTask}
        />

        <TaskModal
          isOpen={editModalOpen}
          task={selectedTask || undefined}
          boardId={permitsBoardId}
          users={project.users}
          onClose={() => setEditModalOpen(false)}
          onSave={(data) => handleSaveTask(data)}
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
