export type Priority = "low" | "medium" | "high";

export type TaskCategory =
  | "work"
  | "personal"
  | "shopping"
  | "health"
  | "finance"
  | "other";

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  category: TaskCategory;
  dueDate?: string; // YYYY-MM-DD format
  createdAt: string; // ISO string
  completedAt?: string; // ISO string
}

export type FilterStatus = "all" | "active" | "completed";

export type SortOption =
  | "manual"
  | "createdAt"
  | "dueDate"
  | "priority"
  | "title";

export interface TaskStats {
  total: number;
  completed: number;
  active: number;
  overdue: number;
  highPriority: number;
}
