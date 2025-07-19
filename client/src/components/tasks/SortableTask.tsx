import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TaskCard from "@/components/kanban/TaskCard";
import type { Task } from "@/types/task";

interface SortableTaskProps {
  task: Task;
  boardId: number;
  onEditTask: (task: Task, boardId: number) => void;
  onViewTask: (task: Task) => void;
}

const SortableTask: React.FC<SortableTaskProps> = ({
  task,
  boardId,
  onEditTask,
  onViewTask,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: task.id,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: "manipulation",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard
        task={task}
        onEdit={() => onEditTask(task, boardId)}
        onView={() => onViewTask(task)}
      />
    </div>
  );
};

export default SortableTask;
