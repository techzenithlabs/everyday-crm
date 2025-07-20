export interface Module {
  id: number;
  name: string;
  parent_id?: number; // ✅ This is what TypeScript is missing
}
