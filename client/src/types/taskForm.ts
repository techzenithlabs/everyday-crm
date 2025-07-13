export interface TaskForm {
  title: string;
  description: string;
  due_date: string; // formatted ISO string
  priority: "Low" | "Medium" | "High";
  labels: string;  // comma-separated
  assigned_to: string; // selected user ID from dropdown
}
