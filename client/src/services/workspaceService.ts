import api from "@/api";

export interface Workspace {
  id: number;
  name: string;
}

export const getWorkspaces = async () => {
  const response = await api.get("/workspaces");

  if (response.data?.status && Array.isArray(response.data.data)) {
    return response.data.data;
  }

  throw new Error("Failed to fetch workspaces");
};

// services/workspaceService.ts
// services/workspaceService.ts
export const createWorkspace = async (payload: { name: string }) => {
  const response = await api.post("/workspaces", payload);

  // ✅ Fix: extract actual workspace object from nested `data`
  if (response.data?.status && response.data?.data) {
    return response.data.data; // returns { id, name, ... }
  }

  throw new Error("Workspace creation failed");
};
