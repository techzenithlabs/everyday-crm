import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { getProjectById } from "@/services/projectService";
import { createTask, updateTask, moveTask } from "@/services/taskService"; // ✅ use moveTask here
import { AxiosError } from "axios";
import api from "@/api";
import { format } from "date-fns";
import TaskModal from "@/components/kanban/TaskModal";
import TaskDragDropBoard from "@/components/tasks/TaskDragDropBoard";
import { showSuccess, showError } from "@/utils/ConfirmDialogHelpers";

import type { User } from "@/types/user";
import type { Task, TaskStatus, TaskPayload } from "@/types/task";
import type { Project } from "@/types/project";

const allowedStatuses: TaskStatus[] = [
  "todo",
  "in_progress",
  "review",
  "blocked",
  "completed",
];

interface ApiErrorResponse {
  errors?: Record<string, string[]>;
}

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [activeBoardId, setActiveBoardId] = useState<number | null>(null);

  const loadProject = useCallback(async () => {
    try {
      const data = await getProjectById(Number(id));
      setProject(data);
      localStorage.setItem("currentProjectId", String(data.id));
    } catch {
      showError("Failed to load project");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      loadProject();
      fetchUsers();
    }
  }, [id, loadProject]);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data.users || []);
    } catch {
      console.warn("Failed to load users");
    }
  };

  const handleTaskMove = async (
    taskId: number,
    fromBoardId: number,
    toBoardId: number,
    newStatus: string,
    newIndex: number
  ) => {
    try {
      await moveTask(taskId, fromBoardId, toBoardId, newStatus, newIndex);
      showSuccess("Task moved successfully");
      loadProject(); // ✅ refresh project after move
    } catch {
      showError("Failed to move task");
    }
  };

  const handleEditTask = (task: Task, boardId: number) => {
    setEditingTask(task);
    setActiveBoardId(boardId);
    setShowTaskModal(true);
  };

  const handleAddTask = (boardId: number) => {
    setEditingTask(null);
    setActiveBoardId(boardId);
    setShowTaskModal(true);
  };

  const handleSaveTask = async (task: Partial<Task>, boardId: number) => {
    try {
      const payload: TaskPayload = {
        title: task.title ?? "Untitled",
        description: task.description,
        due_date: task.due_date
          ? format(new Date(task.due_date), "yyyy-MM-dd HH:mm:ss")
          : undefined,
        priority: task.priority,
        status: allowedStatuses.includes(task.status as TaskStatus)
          ? (task.status as TaskStatus)
          : undefined,
        assigned_to: task.assigned_to,
        labels: task.labels,
      };

      if (task.id) {
        await updateTask(task.id, payload);
        showSuccess("Task updated successfully");
      } else if (boardId && project?.id) {
        await createTask(boardId, {
          ...payload,
          project_id: project.id,
        });
        showSuccess("Task created successfully");
      }

      setShowTaskModal(false);
      loadProject();
    } catch (error) {
      const err = error as AxiosError<ApiErrorResponse>;
      if (err.response?.data?.errors?.general) {
        showError(err.response.data.errors.general[0]);
      } else {
        showError("Something went wrong");
      }
    }
  };

  if (loading) return <div className="p-6">Loading project...</div>;
  if (!project)
    return <div className="p-6 text-red-500">Project not found</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-1">{project.title}</h1>
      <p className="text-gray-600 mb-4">{project.description}</p>

      <div className="mt-6">
        {project.boards?.length === 0 ? (
          <p className="text-gray-400">No boards found.</p>
        ) : (
          <TaskDragDropBoard
            boards={project.boards}
            onTaskMove={handleTaskMove}
            onEditTask={handleEditTask}
            onAddTask={handleAddTask}
            onViewTask={() => {}} // optional view mode if needed
          />
        )}
      </div>

      {showTaskModal && (
        <TaskModal
          isOpen={showTaskModal}
          onClose={() => setShowTaskModal(false)}
          task={editingTask ?? undefined}
          boardId={activeBoardId ?? undefined}
          onSave={handleSaveTask}
          users={users}
        />
      )}
    </div>
  );
};

export default ProjectDetail;
