import api from "@/api";

export const createTask = async (boardId: number, taskData: any) => {
  try {
    const res = await api.post(`/projects/boards/${boardId}/tasks`, taskData);
    if (!res.data.status) throw res.data.errors ?? { general: ["Failed to create task"] };
    return res.data.data;
  } catch (error: any) {
    if (error?.response?.data?.errors) throw error.response.data.errors;
    if (error?.errors) throw error.errors;
    throw { general: ["Task creation failed."] };
  }
};

export const updateTask = async (taskId: number, payload: any) => {
  try {
     const res = await api.put(`/projects/tasks/${taskId}`, payload);
    if (!res.data.status) throw res.data.errors ?? { general: ["Failed to update task"] };
    return res.data.data;
  } catch (error: any) {
    if (error?.response?.data?.errors) throw error.response.data.errors;
    if (error?.errors) throw error.errors;
    throw { general: ["Task update failed."] };
  }
};
