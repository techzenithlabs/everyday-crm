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
  title: string;          // Board title like "Jobs Board"
  slug: string;
  sort_order: number;
  board_type?: BoardType; // Optional nested board type
  tasks: Task[];
}