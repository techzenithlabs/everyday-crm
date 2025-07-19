import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Calendar, User } from "lucide-react";
import { format } from "date-fns";
import type { Task } from "@/types/task";

interface Props {
  task: Task;
  onEdit: () => void;
}

const priorityColors: Record<string, string> = {
  High: "bg-red-100 text-red-600",
  Medium: "bg-yellow-100 text-yellow-600",
  Low: "bg-green-100 text-green-600",
};

const calendarColors: Record<string, string> = {
  High: "text-red-500",
  Medium: "text-yellow-500",
  Low: "text-green-600",
};

const statusColors: Record<string, string> = {
  todo: "bg-gray-200 text-gray-800",
  in_progress: "bg-blue-100 text-blue-700",
  review: "bg-purple-100 text-purple-700",
  blocked: "bg-red-100 text-red-600",
  completed: "bg-green-100 text-green-600",
};

const TaskCard: React.FC<Props> = ({ task, onEdit }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: `${task.id}:${task.board_id}`, // Unique DnD ID
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const formattedStatus =
    task.status?.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase()) || "";

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onEdit}
      className="bg-white border rounded-md p-3 shadow-sm cursor-pointer hover:shadow-md transition-all"
    >
      {/* Title + Status badge */}
      <div className="flex justify-between items-start mb-1">
        <div className="font-semibold text-sm text-gray-800">{task.title}</div>
        {task.status && (
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
              statusColors[task.status] || "bg-gray-200 text-gray-700"
            }`}
          >
            {formattedStatus}
          </span>
        )}
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-gray-500 line-clamp-2">{task.description}</p>
      )}

      {/* Labels */}
      {task.labels && task.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {task.labels.map((label, i) => (
            <span
              key={i}
              className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded"
            >
              {label}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex flex-wrap items-center justify-between text-xs mt-3 gap-1 text-gray-600">
        {task.due_date && (
          <div className="flex items-center gap-1">
            <Calendar
              size={14}
              className={calendarColors[task.priority || "Low"]}
            />
            {format(new Date(task.due_date), "dd MMM")}
          </div>
        )}

        {task.priority && (
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
              priorityColors[task.priority]
            }`}
          >
            {task.priority}
          </span>
        )}

        {task.assigned_to && (
          <div className="flex items-center gap-1">
            <User size={14} />
            <span>User {task.assigned_to}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
