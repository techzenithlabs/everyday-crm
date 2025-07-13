import React from "react";
import BoardColumn from "../kanban/BoardColumn";
import type { Board } from "@/types/board";
import type { Task } from "@/types/task";

interface Props {
boards: Board[];
  onTaskMove: (
    taskId: number,
    fromBoardId: number,
    toBoardId: number,
    newIndex: number
  ) => void;
  onEditTask: (task: Task, boardId: number) => void;
  onViewTask: (task: Task) => void;
  onAddTask: (boardId: number) => void; // ✅ This gets passed from ProjectDetail
}

const TaskDragDropBoard: React.FC<Props> = ({
  boards,
  onTaskMove,
  onEditTask,
  onViewTask,
  onAddTask,
}) => {
  return (
    <div className="flex gap-4">
      {boards.map((board) => (
        <div key={board.id}>
          <BoardColumn
            board={board}
            onAddTask={onAddTask}
            onEditTask={onEditTask}
            onViewTask={onViewTask}
          />
        </div>
      ))}
    </div>
  );
};

export default TaskDragDropBoard;
