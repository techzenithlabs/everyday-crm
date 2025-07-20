import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getProjectById } from "@/services/projectService";
import { updateTask } from "@/services/taskService";

import type { Project } from "@/types/project";
import type { Task } from "@/types/task";
import type { Board } from "@/types/board";
import type { User } from "@/types/user";

import StatusBoard from "@/components/kanban/StatusBoard";
import TaskModal from "@/components/kanban/TaskModal";

import { showSuccess, showError } from "@/utils/ConfirmDialogHelpers";
import { showErrorToast } from "@/utils/toastHelpers";

// ✅ Extend Project type to include users
interface ProjectWithUsers extends Project {
  users: User[];
}

const JobsBoard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<ProjectWithUsers | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Partial<Task> | null>(null);

  const fetchProject = useCallback(async () => {
    try {
      if (!id) return;
      const data = await getProjectById(Number(id));
      setProject(data as ProjectWithUsers); // ✅ Cast only once
      const jobsBoard = data.boards.find(
        (b: Board) => b.slug === "jobs" || b.title.toLowerCase().includes("job")
      );
      if (jobsBoard) {
        setTasks(jobsBoard.tasks ?? []);
      } else {
        showErrorToast("Jobs board not found in this project.");
      }
    } catch {
      showErrorToast("Failed to load project.");
    }
  }, [id]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

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

  const jobsBoardId =
    project?.boards.find(
      (b: Board) => b.slug === "jobs" || b.title.toLowerCase().includes("job")
    )?.id ?? 0;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Jobs Board</h2>

      {project && (
        <>
          <StatusBoard
            tasks={tasks}
            boardId={jobsBoardId}
            setTasks={setTasks}
            onEditTask={handleEditTask}
            onViewTask={handleViewTask}
          />

          <TaskModal
            isOpen={editModalOpen}
            task={selectedTask || undefined}
            boardId={jobsBoardId}
            users={project.users} // ✅ No "any", safe type
            onClose={() => setEditModalOpen(false)}
            onSave={(data) => handleSaveTask(data)}
          />
        </>
      )}
    </div>
  );
};

export default JobsBoard;
