import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { getWorkspaces } from "@/services/workspaceService";

interface Workspace {
  id: number;
  name: string;
}

interface WorkspaceState {
  all: Workspace[];       // list of all workspaces
  current: Workspace | null; // selected workspace
}

const initialState: WorkspaceState = {
  all: [],
  current: null,
};

// ✅ Async thunk to fetch workspaces
export const fetchWorkspaces = createAsyncThunk(
  "workspace/fetchAll",
  async () => {
    const response = await getWorkspaces();
    return response; // must be Workspace[]
  }
);

const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    setCurrentWorkspace(state, action: PayloadAction<Workspace>) {
      state.current = action.payload;
      localStorage.setItem("currentWorkspaceId", action.payload.id.toString());
    },
    clearWorkspace(state) {
      state.current = null;
      localStorage.removeItem("currentWorkspaceId");
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchWorkspaces.fulfilled, (state, action) => {
      state.all = action.payload;
    });
  },
});

// ✅ Export actions + reducer
export const { setCurrentWorkspace, clearWorkspace } = workspaceSlice.actions;
export default workspaceSlice.reducer;
