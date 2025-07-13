import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { getProjectById } from "@/services/projectService";
import { createTask, updateTask } from "@/services/taskService";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import api from "@/api";
import { format, parseISO } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TaskDetailsModal from "@/components/kanban/TaskDetailsModal";
import TaskDragDropBoard from "@/components/tasks/TaskDragDropBoard";

/***********Types **********************/
import type { User } from "@/types/user";
import type { Task } from "@/types/task";
import type { TaskForm } from "@/types/taskForm";
import type { Project } from "@/types/project";
/***********Types **********************/

interface ApiErrorResponse {
  errors?: Record<string, string[]>;
}

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [selectedBoardId, setSelectedBoardId] = useState<number | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskDetails, setTaskDetails] = useState<Task | null>(null);
  const [showTaskDetails, setShowTaskDetails] = useState(false);

  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [users, setUsers] = useState<User[]>([]);

  const [taskForm, setTaskForm] = useState<TaskForm>({
    title: "",
    description: "",
    due_date: "",
    priority: "Medium",
    labels: "",
    assigned_to: "",
  });

  const loadProject = useCallback(async () => {
    try {
      const data = await getProjectById(Number(id));
      setProject(data);
      localStorage.setItem("currentProjectId", String(data.id));
    } catch {
      toast.error("Failed to load project");
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

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowModal(false);
        setErrors({});
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data.users || []);
    } catch {
      console.warn("Failed to load users");
    }
  };

  const openAddTaskModal = (boardId: number) => {
    setSelectedBoardId(boardId);
    setEditMode(false);
    setSelectedTask(null);
    setErrors({});
    setTaskForm({
      title: "",
      description: "",
      due_date: "",
      priority: "Medium",
      labels: "",
      assigned_to: "",
    });
    setShowModal(true);
  };

  const openEditTaskModal = (task: Task, boardId: number) => {
    setSelectedBoardId(boardId);
    setSelectedTask(task);
    setEditMode(true);
    setErrors({});
    setTaskForm({
      title: task.title || "",
      description: task.description || "",
      due_date: task.due_date
        ? format(new Date(task.due_date), "yyyy-MM-dd'T'HH:mm")
        : "",
      priority: task.priority || "Medium",
      labels: task.labels?.join(", ") || "",
      assigned_to: task.assigned_user?.id?.toString() || "",
    });
    setShowModal(true);
  };

  const openTaskDetails = (task: Task) => {
    setTaskDetails(task);
    setShowTaskDetails(true);
  };

  const handleTaskMove = async (
    taskId: number,
    fromBoardId: number,
    toBoardId: number,
    newIndex: number
  ) => {
    try {
      await api.post(`/projects/tasks/${taskId}/move`, {
        from_board_id: fromBoardId,
        to_board_id: toBoardId,
        position: newIndex,
      });
      loadProject();
    } catch (error) {
      console.error("Task move failed", error);
      toast.error("Failed to move task");
    }
  };

  const handleTaskSubmit = async () => {
    if (!selectedBoardId) {
      toast.error("Board ID missing");
      return;
    }

    try {
      setErrors({});
      const payload = {
        title: taskForm.title,
        description: taskForm.description,
        due_date: taskForm.due_date
          ? format(new Date(taskForm.due_date), "yyyy-MM-dd HH:mm:ss")
          : null,
        priority: taskForm.priority,
        labels: taskForm.labels
          ? taskForm.labels.split(",").map((l) => l.trim())
          : [],
        assigned_to: taskForm.assigned_to ? Number(taskForm.assigned_to) : null,
      };

      if (editMode && selectedTask) {
        await updateTask(selectedTask.id, payload);
        toast.success("Task updated");
      } else {
        await createTask(selectedBoardId, payload);
        toast.success("Task created");
      }

      setShowModal(false);
      loadProject();
    } catch (error) {
      const err = error as AxiosError<ApiErrorResponse>;
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
        if (err.response.data.errors.general) {
          toast.error(err.response.data.errors.general[0]);
        }
      } else {
        toast.error("Something went wrong");
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
          <div className="flex gap-4 overflow-x-auto pb-4">
            <TaskDragDropBoard
              boards={project.boards}
              onTaskMove={handleTaskMove}
              onEditTask={openEditTaskModal}
              onViewTask={openTaskDetails}
              onAddTask={openAddTaskModal}
            />
          </div>
        )}
      </div>

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => {
            setShowModal(false);
            setErrors({});
          }}
        >
          <div
            className="bg-white p-6 rounded shadow w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold mb-4">
              {editMode ? "Edit Task" : "Add Task"}
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-sm font-medium">Title</label>
                <input
                  type="text"
                  value={taskForm.title}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, title: e.target.value })
                  }
                  className="w-full border p-2 mb-1 rounded"
                  placeholder="Task Title"
                />
                {errors.title && (
                  <p className="text-sm text-red-500 mb-2">
                    {errors.title[0]}
                  </p>
                )}
              </div>

              <div className="col-span-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  value={taskForm.description}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, description: e.target.value })
                  }
                  className="w-full border p-2 mb-1 rounded"
                  placeholder="Task Description"
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">
                  Due Date & Time
                </label>
                <DatePicker
                  selected={
                    taskForm.due_date ? parseISO(taskForm.due_date) : null
                  }
                  onChange={(date: Date | null) =>
                    setTaskForm({
                      ...taskForm,
                      due_date: date
                        ? format(date, "yyyy-MM-dd'T'HH:mm")
                        : "",
                    })
                  }
                  showTimeSelect
                  timeIntervals={15}
                  dateFormat="Pp"
                  placeholderText="Select date & time"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">
                  Priority
                </label>
                <select
                  value={taskForm.priority}
                  onChange={(e) =>
                    setTaskForm({
                      ...taskForm,
                      priority: e.target.value as TaskForm["priority"],
                    })
                  }
                  className="w-full border p-2 rounded text-sm"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="text-sm font-medium">
                  Labels (comma separated)
                </label>
                <input
                  type="text"
                  value={taskForm.labels}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, labels: e.target.value })
                  }
                  className="w-full border p-2 mb-1 rounded"
                  placeholder="Label1, Label2"
                />
              </div>

              <div className="col-span-2">
                <label className="text-sm font-medium">Assign To</label>
                <select
                  value={taskForm.assigned_to}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, assigned_to: e.target.value })
                  }
                  className="w-full border p-2 mb-3 rounded"
                >
                  <option value="">Select User</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.first_name} {user.last_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowModal(false);
                  setErrors({});
                }}
                className="px-4 py-1 text-sm bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleTaskSubmit}
                className="px-4 py-1 text-sm bg-green-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {showTaskDetails && taskDetails && (
        <TaskDetailsModal
          task={taskDetails}
          onClose={() => setShowTaskDetails(false)}
        />
      )}
    </div>
  );
};

export default ProjectDetail;
