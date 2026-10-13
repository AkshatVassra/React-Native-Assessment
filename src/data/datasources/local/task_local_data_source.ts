import AsyncStorage from '@react-native-async-storage/async-storage';
import { TaskModel } from '../../models/task_model';
import { UserModel } from '../../models/user_model';

const STORAGE_KEYS = {
  TASKS: '@gigtask_tasks_v1',
  USER_SESSION: '@gigtask_user_session_v1',
  ONBOARDING_SEEN: '@gigtask_onboarding_seen_v1',
};

const DEFAULT_GIG_TASKS: TaskModel[] = [
  new TaskModel({
    id: 'gig-task-1',
    title: 'Schedule dentist appointment',
    description: 'Annual dental cleaning and checkup appointment.',
    dueDate: new Date().toISOString(), // Today
    priority: 'medium',
    isCompleted: false,
    category: 'Personal',
    userId: 'default_user',
    createdAt: new Date().toISOString(),
  }),
  new TaskModel({
    id: 'gig-task-2',
    title: 'Prepare Team Meeting',
    description: 'Review weekly gig delivery metrics and platform changes.',
    dueDate: new Date().toISOString(), // Today
    priority: 'high',
    isCompleted: false,
    category: 'Work',
    userId: 'default_user',
    createdAt: new Date().toISOString(),
  }),
  new TaskModel({
    id: 'gig-task-3',
    title: 'Call Charlotte',
    description: 'Coordinate ride-share shifts and airport drops for tomorrow.',
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    priority: 'low',
    isCompleted: false,
    category: 'Personal',
    userId: 'default_user',
    createdAt: new Date().toISOString(),
  }),
  new TaskModel({
    id: 'gig-task-4',
    title: 'Submit exercise 3.1',
    description: 'Complete defensive driving certification online module.',
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    priority: 'medium',
    isCompleted: false,
    category: 'Study',
    userId: 'default_user',
    createdAt: new Date().toISOString(),
  }),
  new TaskModel({
    id: 'gig-task-5',
    title: 'Prepare A/B Test',
    description: 'Test peak hour navigation routing vs highway toll routes.',
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    priority: 'high',
    isCompleted: false,
    category: 'Work',
    userId: 'default_user',
    createdAt: new Date().toISOString(),
  }),
  new TaskModel({
    id: 'gig-task-6',
    title: 'Submit exercise 3.2',
    description: 'Submit gig worker tax deduction logs and vehicle mileage.',
    dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(), // This week
    priority: 'medium',
    isCompleted: false,
    category: 'Study',
    userId: 'default_user',
    createdAt: new Date().toISOString(),
  }),
  new TaskModel({
    id: 'gig-task-7',
    title: 'Water plants 🌱',
    description: 'Water balcony plants and restock delivery tote supplies.',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // This week
    priority: 'low',
    isCompleted: true,
    category: 'Personal',
    userId: 'default_user',
    createdAt: new Date().toISOString(),
  }),
];

export interface TaskLocalDataSource {
  getTasks(userId?: string): Promise<TaskModel[]>;
  saveTasks(tasks: TaskModel[]): Promise<void>;
  addTask(task: TaskModel): Promise<TaskModel>;
  updateTask(task: TaskModel): Promise<TaskModel>;
  deleteTask(taskId: string): Promise<void>;
  toggleTaskStatus(taskId: string): Promise<TaskModel>;
  getUserSession(): Promise<UserModel | null>;
  saveUserSession(user: UserModel): Promise<void>;
  clearUserSession(): Promise<void>;
  hasSeenOnboarding(): Promise<boolean>;
  setOnboardingCompleted(): Promise<void>;
}

export class TaskLocalDataSourceImpl implements TaskLocalDataSource {
  async getTasks(userId?: string): Promise<TaskModel[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.TASKS);
      if (!data) {
        // Initialize with default tasks matching reference mockups
        await this.saveTasks(DEFAULT_GIG_TASKS);
        return DEFAULT_GIG_TASKS;
      }
      const rawList: any[] = JSON.parse(data);
      const tasks = rawList.map((item) => TaskModel.fromJson(item));
      return tasks;
    } catch (error) {
      console.error('[TaskLocalDataSource] Failed to read tasks:', error);
      return DEFAULT_GIG_TASKS;
    }
  }

  async saveTasks(tasks: TaskModel[]): Promise<void> {
    try {
      const serialized = JSON.stringify(tasks.map((t) => t.toJson()));
      await AsyncStorage.setItem(STORAGE_KEYS.TASKS, serialized);
    } catch (error) {
      console.error('[TaskLocalDataSource] Failed to save tasks:', error);
      throw error;
    }
  }

  async addTask(task: TaskModel): Promise<TaskModel> {
    const existing = await this.getTasks();
    const updated = [task, ...existing];
    await this.saveTasks(updated);
    return task;
  }

  async updateTask(task: TaskModel): Promise<TaskModel> {
    const existing = await this.getTasks();
    const index = existing.findIndex((t) => t.id === task.id);
    if (index === -1) {
      throw new Error(`Task with id ${task.id} not found.`);
    }
    existing[index] = task;
    await this.saveTasks(existing);
    return task;
  }

  async deleteTask(taskId: string): Promise<void> {
    const existing = await this.getTasks();
    const filtered = existing.filter((t) => t.id !== taskId);
    await this.saveTasks(filtered);
  }

  async toggleTaskStatus(taskId: string): Promise<TaskModel> {
    const existing = await this.getTasks();
    const target = existing.find((t) => t.id === taskId);
    if (!target) {
      throw new Error(`Task with id ${taskId} not found.`);
    }
    target.isCompleted = !target.isCompleted;
    target.updatedAt = new Date().toISOString();
    await this.saveTasks(existing);
    return target;
  }

  async getUserSession(): Promise<UserModel | null> {
    try {
      const session = await AsyncStorage.getItem(STORAGE_KEYS.USER_SESSION);
      if (!session) return null;
      return UserModel.fromJson(JSON.parse(session));
    } catch {
      return null;
    }
  }

  async saveUserSession(user: UserModel): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_SESSION, JSON.stringify(user.toJson()));
  }

  async clearUserSession(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_SESSION);
  }

  async hasSeenOnboarding(): Promise<boolean> {
    try {
      const val = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_SEEN);
      return val === 'true';
    } catch {
      return false;
    }
  }

  async setOnboardingCompleted(): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_SEEN, 'true');
  }
}
