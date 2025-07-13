// src/utils/workspaceHelpers.ts

export type Workspace = {
  id: number;
  name: string;
};

// ✅ Save current workspace to localStorage
export function setCurrentWorkspace(workspace: Workspace) {
  localStorage.setItem("currentWorkspace", JSON.stringify(workspace));
}

// ✅ Get current workspace from localStorage
export function getCurrentWorkspace(): Workspace | null {
  const data = localStorage.getItem("currentWorkspace");
  if (!data) return null;

  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

// ✅ Clear workspace (if needed on logout)
export function clearCurrentWorkspace() {
  localStorage.removeItem("currentWorkspace");
}
