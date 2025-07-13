import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getProjects } from "@/services/projectService";
import type { Project } from "@/types/project";

interface ProjectState {
  projects: Project[];
  loading: boolean;
  error: string | null;
}

const initialState: ProjectState = {
  projects: [],
  loading: false,
  error: null,
};
export const fetchAllProjects = createAsyncThunk(
  "projects/fetchAll",
  async (workspaceId?: string) => {
    if (!workspaceId) throw new Error("Workspace ID is required");
    const data = await getProjects({ workspace_id: workspaceId }); // ✅ fixed
    return data;
  }
);

const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProjects.fulfilled, (state, action) => {
        state.projects = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load projects";
      });
  },
});

export default projectSlice.reducer;
