import { Task, TaskPriority } from '../../domain/entities/task.entity';

export class TaskModel implements Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
  isCompleted: boolean;
  category?: string;
  userId: string;
  createdAt: string;
  updatedAt?: string;

  constructor(params: {
    id: string;
    title: string;
    description: string;
    dueDate: string;
    priority: TaskPriority;
    isCompleted: boolean;
    category?: string;
    userId: string;
    createdAt: string;
    updatedAt?: string;
  }) {
    this.id = params.id;
    this.title = params.title;
    this.description = params.description;
    this.dueDate = params.dueDate;
    this.priority = params.priority;
    this.isCompleted = params.isCompleted;
    this.category = params.category || 'General';
    this.userId = params.userId;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
  }

  static fromJson(json: any): TaskModel {
    return new TaskModel({
      id: json.id || json._id || String(Date.now()),
      title: json.title || '',
      description: json.description || '',
      dueDate: json.dueDate || new Date().toISOString(),
      priority: (json.priority || 'medium') as TaskPriority,
      isCompleted: Boolean(json.isCompleted),
      category: json.category || 'General',
      userId: json.userId || 'guest',
      createdAt: json.createdAt || new Date().toISOString(),
      updatedAt: json.updatedAt,
    });
  }

  toJson(): Record<string, any> {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      dueDate: this.dueDate,
      priority: this.priority,
      isCompleted: this.isCompleted,
      category: this.category,
      userId: this.userId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  toEntity(): Task {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      dueDate: this.dueDate,
      priority: this.priority,
      isCompleted: this.isCompleted,
      category: this.category,
      userId: this.userId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  static fromEntity(entity: Task): TaskModel {
    return new TaskModel({
      id: entity.id,
      title: entity.title,
      description: entity.description,
      dueDate: entity.dueDate,
      priority: entity.priority,
      isCompleted: entity.isCompleted,
      category: entity.category,
      userId: entity.userId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }
}
