import React from "react";
import { format } from "date-fns";
import { X } from "lucide-react";
import StatusBadge from "../common/StatusBadge";

interface Task {
  id: number;
  title: string;
  description?: string;
  due_date?: string;
  priority?: string;
  labels?: string[];
  assigned_to?: number;
  status?: string;
  assigned_user?: {
    first_name: string;
    last_name: string;
  };
}

interface Props {
  task: Task;
  onClose: () => void;
}

const TaskDetailsModal: React.FC<Props> = ({ task, onClose }) => {
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

        <h2 className="text-xl font-semibold mb-3">{task.title}</h2>

        {task.description && (
          <p className="text-sm text-gray-700 mb-3 whitespace-pre-wrap">
            {task.description}
          </p>
        )}

        <div className="space-y-2 text-sm">
          {task.due_date && (
            <div className="flex items-center gap-2 text-gray-600">
              <span>📅</span>
              <span>
                Due:{" "}
                {format(new Date(task.due_date), "PPPpp")}
              </span>
            </div>
          )}

          {task.priority && (
            <div>
              <strong>Priority:</strong>{" "}
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  task.priority === "High"
                    ? "bg-red-100 text-red-600"
                    : task.priority === "Medium"
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-green-100 text-green-600"
                }`}
              >
                {task.priority}
              </span>
            </div>
          )}

          {task.status && (
            <div className="flex items-center gap-2">
              <strong>Status:</strong>
              <StatusBadge status={task.status} />
            </div>
          )}

          {task.labels && task.labels.length > 0 && (
            <div>
              <strong>Labels:</strong>
              <div className="flex flex-wrap gap-2 mt-1">
                {task.labels.map((label, idx) => (
                  <span
                    key={idx}
                    className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {task.assigned_user && (
            <div>
              <strong>Assigned To:</strong>{" "}
              <span>
                {task.assigned_user.first_name} {task.assigned_user.last_name}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsModal;
