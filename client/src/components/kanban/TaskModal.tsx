import React, { useEffect, useState, forwardRef } from "react";
import { X, CalendarDays } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import type { Task } from "@/types/task";
import type { User } from "@/types/user";

interface Props {
  isOpen: boolean;
  task?: Partial<Task>;
  boardId?: number;
  onClose: () => void;
  onSave: (data: Partial<Task>, boardId: number) => void;
  users?: User[];
}

const CustomDateInput = forwardRef<
  HTMLInputElement,
  {
    value?: string;
    onClick?: () => void;
    placeholder?: string;
  }
>(({ value, onClick, placeholder }, ref) => (
  <div
    className="w-full h-[44px] border rounded flex items-center px-3 gap-2 cursor-pointer focus-within:ring-2 focus-within:ring-blue-500"
    onClick={onClick}
  >
    <CalendarDays
      size={20}
      className="text-blue-600 flex-shrink-0 pointer-events-none"
    />
    <input
      type="text"
      readOnly
      ref={ref}
      value={value}
      placeholder={placeholder}
      className="w-full h-full bg-transparent outline-none text-sm"
    />
  </div>
));
CustomDateInput.displayName = "CustomDateInput";

const TaskModal: React.FC<Props> = ({
  isOpen,
  task,
  boardId,
  onClose,
  onSave,
  users = [],
}) => {
  const [form, setForm] = useState<Partial<Task>>({
    title: "",
    description: "",
    due_date: "",
    priority: "Medium",
    status: "todo",
    assigned_to: undefined,
  });

  useEffect(() => {
    if (task) {
      setForm({
        id: task.id,
        title: task.title ?? "",
        description: task.description ?? "",
        due_date: task.due_date ? new Date(task.due_date).toISOString() : "",
        priority: task.priority ?? "Medium",
        status: task.status || "todo",
        assigned_to: task.assigned_to ?? undefined,
        labels: task.labels ?? [],
      });
    }
  }, [task]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "assigned_to" ? Number(value) : value,
    }));
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setForm((prev) => ({
        ...prev,
        due_date: date.toISOString(),
      }));
    }
  };

  const handleSubmit = () => {
    if (!form.title?.trim()) {
      alert("Title is required");
      return;
    }

    onSave(
      {
        ...form,
        id: task?.id,
      },
      boardId ?? 0
    );

    onClose();
  };

  // ✅ Avoid rendering if isOpen is false
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-4">
          {task?.id ? "Edit Task" : "Create Task"}
        </h2>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              name="title"
              value={form.title || ""}
              onChange={handleChange}
              placeholder="Title"
              className="w-full border p-2 rounded h-[44px]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={form.description || ""}
              onChange={handleChange}
              placeholder="Description"
              rows={4}
              className="w-full border p-2 rounded resize-none"
            />
          </div>

          {/* Due Date + Priority */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Due Date</label>
              <DatePicker
                selected={form.due_date ? new Date(form.due_date) : null}
                onChange={handleDateChange}
                showTimeSelect
                dateFormat="dd MMM yyyy, h:mm aa"
                placeholderText="Select due date"
                customInput={<CustomDateInput />}
                minDate={new Date()}
                calendarClassName="rounded-lg border shadow-xl"
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Priority</label>
              <select
                name="priority"
                value={form.priority || "Medium"}
                onChange={handleChange}
                className="w-full border p-2 rounded h-[44px]"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              name="status"
              value={form.status || "todo"}
              onChange={handleChange}
              className="w-full border p-2 rounded h-[44px]"
            >
              <option value="todo">TODO</option>
              <option value="in_progress">IN PROGRESS</option>
              <option value="review">REVIEW</option>
              <option value="blocked">BLOCKED</option>
              <option value="completed">COMPLETED</option>
            </select>
          </div>

          {/* Assigned To */}
          <div>
            <label className="block text-sm font-medium mb-1">Assign To</label>
            <select
              name="assigned_to"
              value={form.assigned_to ?? ""}
              onChange={handleChange}
              className="w-full border p-2 rounded h-[44px]"
            >
              <option value="">Assign to</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.first_name} {user.last_name}
                </option>
              ))}
            </select>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
