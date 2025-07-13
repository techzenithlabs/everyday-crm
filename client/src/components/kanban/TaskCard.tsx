import { format } from "date-fns";
import StatusBadge from "@/components/common/StatusBadge";
import type { Task } from "@/types/task";

interface TaskCardProps {
  task: Task;
  onEdit?: () => void;
  onView?: () => void;
}

const TaskCard = ({ task, onEdit, onView }: TaskCardProps) => {
  const handleClick = () => {
    if (onView) onView(); // Click to view details
  };

  return (
    <div
      className="bg-white p-3 rounded shadow-sm border hover:shadow cursor-pointer space-y-2"
      onClick={handleClick}
      onDoubleClick={onEdit} // Optional: Double-click to edit
    >
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold">{task.title || "Untitled Task"}</h3>
        {task.status && <StatusBadge status={task.status} />}
      </div>

      {task.description && (
        <p className="text-xs text-gray-600 truncate">{task.description}</p>
      )}

      {task.due_date && (
        <p className="text-xs text-gray-500">
          📅 {format(new Date(task.due_date), "dd MMM yyyy, h:mm a")}
        </p>
      )}

      {task.assigned_user?.first_name && (
        <p className="text-xs text-blue-600 font-medium">
          👤 {task.assigned_user.first_name} {task.assigned_user.last_name}
        </p>
      )}
    </div>
  );
};

export default TaskCard;
