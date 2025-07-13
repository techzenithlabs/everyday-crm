// File: types/project.ts
import type { Board } from "./board";

export interface Project {
  id: number;
  title: string;
  description?: string;
  boards: Board[];
}
