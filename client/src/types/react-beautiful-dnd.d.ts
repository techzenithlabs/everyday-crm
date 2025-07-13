declare module "react-beautiful-dnd" {
  import * as React from "react";

  type PropsWithChildren<P = unknown> = P & { children?: React.ReactNode };

  // Allow generic props but avoid 'any'
  export const DragDropContext: React.FC<{
    onDragEnd: (result: DropResult) => void;
    children: React.ReactNode;
  }>;

  export const Droppable: React.FC<{
    droppableId: string;
    children: (provided: DroppableProvided) => React.ReactNode;
  }>;

  export const Draggable: React.FC<{
    draggableId: string;
    index: number;
    children: (provided: DraggableProvided) => React.ReactNode;
  }>;

  export interface DropResult {
    draggableId: string;
    type?: string;
    source: {
      index: number;
      droppableId: string;
    };
    destination: {
      droppableId: string;
      index: number;
    } | null;
    reason?: "DROP" | "CANCEL";
    mode?: "FLUID" | "SNAP";
    combine?: {
      draggableId: string;
      droppableId: string;
    };
  }

  export interface DraggableProvided {
    innerRef: (element?: HTMLElement | null) => void;
    draggableProps: React.HTMLAttributes<HTMLElement>;
    dragHandleProps?: React.HTMLAttributes<HTMLElement>;
  }

  export interface DroppableProvided {
    innerRef: (element?: HTMLElement | null) => void;
    droppableProps: React.HTMLAttributes<HTMLElement>;
    placeholder?: React.ReactNode;
  }
}
