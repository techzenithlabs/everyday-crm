// File: types/project.ts
import type { Board } from "./board";
import type { User } from "./user"; 

export interface Project {
  id: number;
  title: string;
  description?: string;
  boards: Board[];
  users?: User[];
}


export interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: Partial<Project>; // optional and flexible
}

