// File: types/project.ts
import type { Board } from "./board";

export interface Project {
  id: number;
  title: string;
  description?: string;
  boards: Board[];
}


export interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: Partial<Project>; // optional and flexible
}

