import { format } from "date-fns";
import StatusBadge from "@/components/common/StatusBadge";
import type { Task } from "@/types/task";
import { Calendar, User as UserIcon, AlertTriangle } from "lucide-react";

interface TaskCardProps {
  task: Task;
  onEdit?: () => void;
  onView?: () => void;
}

const getPriorityColor = (priority: string | undefined) => {
  switch (priority) {
    case "High":
      return "bg-red-100 text-red-700";
    case "Medium":
      return "bg-yellow-100 text-yellow-700";
    case "Low":
      return "bg-green-100 text-green-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const TaskCard = ({ task, onEdit, onView }: TaskCardProps) => {
  const handleClick = () => {
    if (onView) onView();
  };

  return (
    <div
      className="bg-white p-3 rounded shadow-sm border hover:shadow cursor-pointer space-y-2 transition"
      onClick={handleClick}
      onDoubleClick={onEdit}
    >
      {/* Title + Status */}
      <div className="flex justify-between items-start">
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
          {task.title || "Untitled Task"}
        </h3>
        {task.status && <StatusBadge status={task.status} />}
      </div>

      {/* Optional Description */}
      {task.description && (
        <p className="text-xs text-gray-600 line-clamp-2">{task.description}</p>
      )}

      {/* Footer Info */}
      <div className="flex flex-wrap gap-2 items-center text-xs text-gray-700">
        {task.due_date && (
          <div className="flex items-center gap-1">
            <span>📅</span>{format(new Date(task.due_date), "dd MMM yyyy, h:mm a")}
          </div>
        )}

        {task.priority && (
          <div
            className={`px-2 py-0.5 rounded-full flex items-center gap-1 ${getPriorityColor(
              task.priority
            )}`}
          >
            <AlertTriangle size={12} /> {task.priority}
          </div>
        )}

        {task.assigned_user?.first_name && (
          <div className="flex items-center gap-1 ml-auto">
            <UserIcon size={14} />
            <span>
              {task.assigned_user.first_name} {task.assigned_user.last_name}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
