import api from "../api";

// ✅ Get all projects
export const getProjects = async (params: { workspace_id: string }) => {
  const res = await api.get("/projects", { params });
  if (!res.data.status) throw new Error("Failed to fetch projects");
  return res.data.data;
};

// ✅ Get a single project by ID
export const getProjectById = async (id: number) => {
  const res = await api.get(`/projects/${id}`);
  if (!res.data.status) throw new Error("Failed to fetch project");
  return res.data.data;
};

// ✅ Create new project
export const createProject = async (payload: {
  workspace_id: string;
  title: string;
  description?: string;
}) => {
  const res = await api.post("/projects", payload);
  if (!res.data.status) throw new Error("Failed to create project");
  return res.data.data;
};

// ✅ Update project
export const updateProject = async (
  id: number,
  payload: { title: string; description?: string }
) => {
  const res = await api.put(`/projects/${id}`, payload);
  if (!res.data.status) throw new Error("Failed to update project");
  return res.data.data;
};

// ✅ Delete project
export const deleteProject = async (id: number) => {
  const res = await api.delete(`/projects/${id}`);
  if (!res.data.status) throw new Error("Failed to delete project");
  return res.data.data;
};

// ✅ Get all boards for a given project
export const getBoardsByProject = async (projectId: number) => {
  const res = await api.get(`/projects/${projectId}/boards`);
  if (!res.data.status) throw new Error("Failed to fetch boards");
  return res.data.data;
};
