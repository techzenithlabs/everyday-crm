  import { useState } from "react";
  import { createTask } from "@/services/taskService";
  import { showSuccessToast, showErrorToast } from "@/utils/toastHelpers";
  import type { TaskPayload } from "@/types/task";

  interface Props {
    isOpen: boolean;
    onClose: () => void;
    boardId: number;
    onTaskCreated?: () => void;
  }

  const TaskModal: React.FC<Props> = ({
    isOpen,
    onClose,
    boardId,
    onTaskCreated,
  }) => {
    const [form, setForm] = useState<TaskPayload>({
      title: "",
      description: "",
      due_date: "",
      priority: "Low",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      setForm({ ...form, [e.target.name]: e.target.value });
    };

    const resetForm = () => {
      setForm({ title: "", description: "", due_date: "", priority: "Low" });
    };

    const handleSubmit = async () => {
      if (!form.title.trim()) {
        showErrorToast({ message: "Title is required" });
        return;
      }

      setLoading(true);

      try {
        const res = await createTask(boardId, form);
        showSuccessToast(res.message || "Task created successfully");

        resetForm();
        onClose();
        onTaskCreated?.();
      } catch (error) {
        showErrorToast(error);
      } finally {
        setLoading(false);
      }
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div
          className="bg-white rounded-lg shadow p-6 w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-lg font-semibold mb-4">Create Task</h2>

          <input
            type="text"
            name="title"
            placeholder="Task title"
            value={form.title}
            onChange={handleChange}
            className="w-full border p-2 rounded mb-3"
          />

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="w-full border p-2 rounded mb-3"
          />

          <input
            type="date"
            name="due_date"
            value={form.due_date}
            onChange={handleChange}
            className="w-full border p-2 rounded mb-3"
          />

          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className="w-full border p-2 rounded mb-3"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="bg-gray-300 px-4 py-1 rounded text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-1 rounded text-sm"
            >
              {loading ? "Saving..." : "Create"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  export default TaskModal;
