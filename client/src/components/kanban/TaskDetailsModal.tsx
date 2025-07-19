import React, { useState } from "react";
import { format } from "date-fns";
import { X } from "lucide-react";
import StatusBadge from "../common/StatusBadge";
import { Calendar, AlertTriangle } from "lucide-react";
import { getDueDateColor } from "@/utils/dateHelpers";
import type { Task } from "@/types/task";

interface Props {
  task: Task;
  onClose: () => void;
  onUpdate: (updatedTask: Task) => Promise<void>;
}

const TaskDetailsModal: React.FC<Props> = ({ task, onClose, onUpdate }) => {
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<Task>({ ...task });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log("Saving task:", form);
    onUpdate(form);
    setEditMode(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {editMode ? "Edit Task" : form.title}
          </h2>
          <button
            className="text-sm text-blue-600 hover:underline"
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? "Cancel" : "Edit"}
          </button>
        </div>

        {editMode ? (
          <div className="space-y-3">
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Title"
              className="w-full border p-2 rounded"
            />

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
              className="w-full border p-2 rounded"
            />

            <input
              type="datetime-local"
              name="due_date"
              value={form.due_date?.slice(0, 16) || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />

            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="">Select Priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="todo">TODO</option>
              <option value="in_progress">IN PROGRESS</option>
              <option value="review">REVIEW</option>
              <option value="blocked">BLOCKED</option>
              <option value="completed">COMPLETED</option>
            </select>

            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        ) : (
          <div className="space-y-2 text-sm">
            {form.description && (
              <p className="text-gray-700 whitespace-pre-wrap">
                {form.description}
              </p>
            )}

            {form.due_date && (
              <div
                className={`flex items-center gap-2 ${getDueDateColor(
                  form.due_date
                )}`}
              >
                <Calendar size={14} />
                <span>{format(new Date(form.due_date), "PPPpp")}</span>
              </div>
            )}

            {form.priority && (
              <div className="flex items-center gap-2">
                <strong>Priority:</strong>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    form.priority === "High"
                      ? "bg-red-100 text-red-600"
                      : form.priority === "Medium"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  <AlertTriangle size={12} className="inline mr-1" />
                  {form.priority}
                </span>
              </div>
            )}

            {form.status && (
              <div className="flex items-center gap-2">
                <strong>Status:</strong>
                <StatusBadge status={form.status} />
              </div>
            )}

            {form.assignee && (
              <div>
                <strong>Assigned To:</strong>{" "}
                <span>
                  {form.assignee.first_name} {form.assignee.last_name}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskDetailsModal;
