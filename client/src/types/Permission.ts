// client/src/types/Permission.ts

export interface Permission {
  id: number;
  name: string;
  children?: Permission[];
}
