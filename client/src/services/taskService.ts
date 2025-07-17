import api from "@/api";
import type { Task, TaskPayload } from "@/types/task";
import type { ApiResponse } from "@/types/common";

export const createTask = async (
  boardId: number,
  taskData: TaskPayload
): Promise<ApiResponse<Task>> => {
  const res = await api.post(`/projects/boards/${boardId}/tasks`, taskData);

  if (!res.data.status) {
    throw new Error(res.data.message || "Task creation failed");
  }

  return res.data;
};

export const updateTask = async (
  taskId: number,
  payload: TaskPayload
): Promise<ApiResponse<Task>> => {
  const res = await api.put(`/projects/tasks/${taskId}`, payload);

  if (!res.data.status) {
    throw new Error(res.data.message || "Task update failed");
  }

  return res.data;
};
