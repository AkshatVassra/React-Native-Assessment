export type TaskPriority = 'low' | 'medium' | 'high';

export type TaskStatusFilter = 'all' | 'pending' | 'completed';
export type TaskPriorityFilter = 'all' | 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string; // ISO string format
  priority: TaskPriority;
  isCompleted: boolean;
  category?: string; // e.g. "Personal", "Work", "Delivery", "App", "CF", "Study"
  userId: string;
  createdAt: string;
  updatedAt?: string;
}

export interface TaskFilterCriteria {
  priority: TaskPriorityFilter;
  status: TaskStatusFilter;
  searchQuery?: string;
  category?: string;
}
