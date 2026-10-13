import { TaskRepository } from '../../domain/repositories/task_repository';
import { Task } from '../../domain/entities/task.entity';
import { Result } from '../../core/utils/result';
import { Failure, CacheFailure } from '../../core/errors/failures';
import { TaskLocalDataSource } from '../datasources/local/task_local_data_source';
import { TaskRemoteDataSource } from '../datasources/remote/task_remote_data_source';
import { TaskModel } from '../models/task_model';

export class TaskRepositoryImpl implements TaskRepository {
  constructor(
    private readonly localDataSource: TaskLocalDataSource,
    private readonly remoteDataSource: TaskRemoteDataSource
  ) {}

  async getTasks(userId: string): Promise<Result<Task[]>> {
    try {
      // 1. Fetch from local cache first for instant UI response
      const localTasks = await this.localDataSource.getTasks(userId);

      // 2. Try fetching latest from remote in background / sync if available
      try {
        const userSession = await this.localDataSource.getUserSession();
        const remoteTasks = await this.remoteDataSource.fetchTasks(userId, userSession?.token);
        if (remoteTasks && remoteTasks.length > 0) {
          await this.localDataSource.saveTasks(remoteTasks);
          return Result.ok(remoteTasks.map((t) => t.toEntity()));
        }
      } catch {
        // Fall back gracefully to local storage if remote is unreachable
      }

      return Result.ok(localTasks.map((t) => t.toEntity()));
    } catch (error: any) {
      if (error instanceof Failure) {
        return Result.fail(error);
      }
      return Result.fail(new CacheFailure(error?.message || 'Failed to retrieve tasks.'));
    }
  }

  async createTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Result<Task>> {
    try {
      const id = `task_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const now = new Date().toISOString();

      const newTask = new TaskModel({
        ...taskData,
        id,
        createdAt: now,
        updatedAt: now,
      });

      // Save to local storage first
      await this.localDataSource.addTask(newTask);

      // Attempt remote sync
      try {
        const userSession = await this.localDataSource.getUserSession();
        await this.remoteDataSource.saveTask(newTask, userSession?.token);
      } catch {
        // Silently queue or log remote failure while preserving local offline task
      }

      return Result.ok(newTask.toEntity());
    } catch (error: any) {
      if (error instanceof Failure) {
        return Result.fail(error);
      }
      return Result.fail(new CacheFailure(error?.message || 'Failed to create task.'));
    }
  }

  async updateTask(task: Task): Promise<Result<Task>> {
    try {
      const taskModel = TaskModel.fromEntity({
        ...task,
        updatedAt: new Date().toISOString(),
      });

      await this.localDataSource.updateTask(taskModel);

      // Attempt remote sync
      try {
        const userSession = await this.localDataSource.getUserSession();
        await this.remoteDataSource.saveTask(taskModel, userSession?.token);
      } catch {
        // Remote sync fallback
      }

      return Result.ok(taskModel.toEntity());
    } catch (error: any) {
      if (error instanceof Failure) {
        return Result.fail(error);
      }
      return Result.fail(new CacheFailure(error?.message || 'Failed to update task.'));
    }
  }

  async deleteTask(taskId: string): Promise<Result<void>> {
    try {
      await this.localDataSource.deleteTask(taskId);

      // Attempt remote sync
      try {
        const userSession = await this.localDataSource.getUserSession();
        if (userSession) {
          await this.remoteDataSource.deleteTask(taskId, userSession.id, userSession.token);
        }
      } catch {
        // Remote sync fallback
      }

      return Result.ok(undefined);
    } catch (error: any) {
      if (error instanceof Failure) {
        return Result.fail(error);
      }
      return Result.fail(new CacheFailure(error?.message || 'Failed to delete task.'));
    }
  }

  async toggleTaskStatus(taskId: string): Promise<Result<Task>> {
    try {
      const updated = await this.localDataSource.toggleTaskStatus(taskId);

      // Attempt remote sync
      try {
        const userSession = await this.localDataSource.getUserSession();
        await this.remoteDataSource.saveTask(updated, userSession?.token);
      } catch {
        // Remote sync fallback
      }

      return Result.ok(updated.toEntity());
    } catch (error: any) {
      if (error instanceof Failure) {
        return Result.fail(error);
      }
      return Result.fail(new CacheFailure(error?.message || 'Failed to toggle task status.'));
    }
  }
}
