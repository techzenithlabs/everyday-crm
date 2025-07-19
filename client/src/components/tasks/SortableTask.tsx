import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "@/types/task";

interface Props {
  id: string;
  task: Task;
  boardId: number;
  onEditTask: (task: Task, boardId: number) => void;
  onViewTask: (task: Task) => void;
}

const SortableTask: React.FC<Props> = ({ id, task, boardId, onEditTask }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    cursor: "grab",
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-400";
      case "low":
        return "bg-green-400";
      default:
        return "bg-gray-300";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "todo":
        return "bg-blue-100 text-blue-600";
      case "in_progress":
        return "bg-yellow-100 text-yellow-600";
      case "done":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white rounded-md shadow-sm border p-4 mb-3 hover:shadow-md transition"
    >
      {/* ✅ Edit button at top-right */}
      <div className="flex justify-end mb-1">
        <button
          onClick={() => onEditTask(task, boardId)}
          className="text-xs text-blue-600 hover:underline"
        >
          Edit
        </button>
      </div>

      {/* ✅ Task title + status on same line */}
      <div className="flex justify-between items-center mb-1">
        <h4 className="text-sm font-semibold text-gray-800">{task.title}</h4>
        {task.status && (
          <span
            className={`text-[10px] font-medium px-2 py-[2px] rounded-full ${getStatusColor(
              task.status
            )}`}
          >
            {task.status.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
          </span>
        )}
      </div>

      {/* ✅ Description */}
      {task.description && (
        <p className="text-xs text-gray-500 mb-2">{task.description}</p>
      )}

      {/* ✅ Due date & priority */}
      <div className="flex justify-between items-center text-xs text-gray-500">
        {task.due_date && (
          <span className="flex items-center">
            📅 Due: {new Date(task.due_date).toLocaleDateString()}
          </span>
        )}
        {task.priority && (
          <span
            className={`text-white text-[10px] px-2 py-[2px] rounded-full ${getPriorityColor(
              task.priority
            )}`}
          >
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </span>
        )}
      </div>
    </div>
  );
};

export default SortableTask;
