import { Task, Priority } from '../types';

const STORAGE_KEY = 'task_manager_app_tasks_v1';

export const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    title: 'Review quarterly project deliverables',
    description: 'Ensure all pull requests and documentation are up to date for team review.',
    completed: false,
    priority: 'high',
    category: 'work',
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Weekly grocery list & meal planning',
    description: 'Buy fresh vegetables, high-protein snacks, and olive oil.',
    completed: false,
    priority: 'medium',
    category: 'shopping',
    dueDate: new Date(Date.now() + 172800000).toISOString().split('T')[0],
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '3',
    title: 'Schedule dentist checkup',
    description: 'Annual cleaning and routine inspection.',
    completed: true,
    priority: 'low',
    category: 'health',
    dueDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    completedAt: new Date(Date.now() - 43200000).toISOString(),
  },
];

export function loadTasks(): Task[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_TASKS));
      return INITIAL_TASKS;
    }
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : INITIAL_TASKS;
  } catch (err) {
    console.error('Failed to load tasks from localStorage', err);
    return INITIAL_TASKS;
  }
}

export function saveTasks(tasks: Task[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (err) {
    console.error('Failed to save tasks to localStorage', err);
  }
}

export function isOverdue(dueDate?: string, completed?: boolean): boolean {
  if (!dueDate || completed) return false;
  const today = new Date().toISOString().split('T')[0];
  return dueDate < today;
}

export function isDueToday(dueDate?: string): boolean {
  if (!dueDate) return false;
  const today = new Date().toISOString().split('T')[0];
  return dueDate === today;
}

export function formatDueDateLabel(dueDate?: string): { text: string; isOverdue: boolean; isToday: boolean } {
  if (!dueDate) return { text: 'No due date', isOverdue: false, isToday: false };
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  if (dueDate === todayStr) {
    return { text: 'Due Today', isOverdue: false, isToday: true };
  }
  if (dueDate === tomorrow) {
    return { text: 'Due Tomorrow', isOverdue: false, isToday: false };
  }
  if (dueDate === yesterday) {
    return { text: 'Yesterday', isOverdue: true, isToday: false };
  }

  const [year, month, day] = dueDate.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day);
  const formatted = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  if (dueDate < todayStr) {
    return { text: `Overdue (${formatted})`, isOverdue: true, isToday: false };
  }

  return { text: formatted, isOverdue: false, isToday: false };
}

export const PRIORITY_WEIGHT: Record<Priority, number> = {
  high: 3,
  medium: 2,
  low: 1,
};
