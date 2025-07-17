export type TaskStatus = "todo" | "in_progress" | "review" | "blocked" | "completed";

export interface Task {
  id: number;
  title: string;
  description?: string;
  due_date?: string;
  priority?: "Low" | "Medium" | "High";
  labels?: string[];
  assigned_user?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  status?: TaskStatus; // ✅ Add status here
  board_id: number;
  project_id: number;
  created_at?: string;
  updated_at?: string;
}


// In types/task.ts

export interface TaskPayload {
  title: string;
  description?: string;
  due_date?: string;
  priority?: "Low" | "Medium" | "High";
  labels?: string[];
  assigned_to?: number | null; // Not full user, just user ID
  status?: TaskStatus;
}

