import { useState } from "react";
import { createTask } from "@/services/taskService";
import { toast } from "react-toastify";

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
  const [form, setForm] = useState({
    title: "",
    description: "",
    due_date: "",
    priority: "low", // default
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }

    try {
      setLoading(true);
      await createTask(boardId, form); // ✅ FIXED

      toast.success("Task created");
      setForm({ title: "", description: "", due_date: "", priority: "low" });
      onClose();
      onTaskCreated?.();
    } catch (error) {
      toast.error("Failed to create task");
      console.error(error);
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
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
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
