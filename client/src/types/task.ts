import type { User } from "./user";
export type TaskStatus = "todo" | "in_progress" | "review" | "blocked" | "completed";

export interface Task {
  id: number;
  title: string;
  description?: string;
  due_date?: string;
  priority?: "Low" | "Medium" | "High";
  labels?: string[];
  assigned_to?: number | null;
  assignee?: User; // ✅ Add this line
  status?: "todo" | "in_progress" | "review" | "blocked" | "completed";
  board_id: number;
  project_id: number;
  position?: number;
  created_at?: string;
  updated_at?: string;
}

// In types/task.ts

export interface TaskPayload {
  title?: string;
  description?: string;
  due_date?: string;
  priority?: "Low" | "Medium" | "High";
  labels?: string[];
  assigned_to?: number | null;
  status?: TaskStatus;
  project_id?: number;
  board_id?: number; // ✅ Add this line
}

