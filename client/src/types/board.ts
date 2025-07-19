// File: types/board.ts
import type { Task } from "./task";

export interface BoardType {
  id: number;
  name: string;
  slug: string;
  sort_order: number;
}

export interface Board {
  id: number;
  title: string;
  slug?: string; // optional if not used
  sort_order?: number;
  project_id: number;
  created_at?: string;
  updated_at?: string;
  tasks: Task[]; // ✅ This is what enables nested board.tasks
}