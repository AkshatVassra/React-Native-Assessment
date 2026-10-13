import { Result } from '../../core/utils/result';
import { Task } from '../entities/task.entity';

export interface TaskRepository {
  getTasks(userId: string): Promise<Result<Task[]>>;
  createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Result<Task>>;
  updateTask(task: Task): Promise<Result<Task>>;
  deleteTask(taskId: string): Promise<Result<void>>;
  toggleTaskStatus(taskId: string): Promise<Result<Task>>;
}
