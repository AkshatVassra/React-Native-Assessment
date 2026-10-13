import { TaskModel } from '../../models/task_model';
import { FirebaseConfig } from '../../../core/network/firebase.config';
import { ServerFailure } from '../../../core/errors/failures';

export interface TaskRemoteDataSource {
  fetchTasks(userId: string, token?: string): Promise<TaskModel[]>;
  saveTask(task: TaskModel, token?: string): Promise<TaskModel>;
  deleteTask(taskId: string, userId: string, token?: string): Promise<void>;
}

export class TaskRemoteDataSourceImpl implements TaskRemoteDataSource {
  private readonly baseUrl = FirebaseConfig.databaseURL;

  async fetchTasks(userId: string, token?: string): Promise<TaskModel[]> {
    if (!this.baseUrl || this.baseUrl.includes('gigtask-manager-app-default-rtdb')) {
      return [];
    }
    try {
      const url = `${this.baseUrl}/users/${userId}/tasks.json${token ? `?auth=${token}` : ''}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const response = await fetch(url, {
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json' },
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new ServerFailure(`Failed to fetch tasks: ${response.statusText}`);
      }

      const data = await response.json();
      if (!data) return [];

      // RTDB returns an object with keys
      const list: TaskModel[] = Object.keys(data).map((key) => {
        const item = data[key];
        return TaskModel.fromJson({ ...item, id: key });
      });
      return list;
    } catch (error: any) {
      // In offline mode or demo mode, bubble up error so repository can use local cache
      throw new ServerFailure(error?.message || 'Remote task fetch failed.');
    }
  }

  async saveTask(task: TaskModel, token?: string): Promise<TaskModel> {
    if (!this.baseUrl || this.baseUrl.includes('gigtask-manager-app-default-rtdb')) {
      return task;
    }
    try {
      const url = `${this.baseUrl}/users/${task.userId}/tasks/${task.id}.json${token ? `?auth=${token}` : ''}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const response = await fetch(url, {
        method: 'PUT',
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task.toJson()),
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new ServerFailure(`Failed to save remote task: ${response.statusText}`);
      }

      return task;
    } catch (error: any) {
      throw new ServerFailure(error?.message || 'Remote task save failed.');
    }
  }

  async deleteTask(taskId: string, userId: string, token?: string): Promise<void> {
    if (!this.baseUrl || this.baseUrl.includes('gigtask-manager-app-default-rtdb')) {
      return;
    }
    try {
      const url = `${this.baseUrl}/users/${userId}/tasks/${taskId}.json${token ? `?auth=${token}` : ''}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const response = await fetch(url, {
        method: 'DELETE',
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json' },
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new ServerFailure(`Failed to delete remote task: ${response.statusText}`);
      }
    } catch (error: any) {
      throw new ServerFailure(error?.message || 'Remote task delete failed.');
    }
  }
}
