import { BlocEvent } from '../../../core/bloc/bloc.base';
import {
  Task,
  TaskPriority,
  TaskPriorityFilter,
  TaskStatusFilter,
} from '../../../domain/entities/task.entity';

export interface LoadTasksEvent extends BlocEvent {
  type: 'LOAD_TASKS';
  userId?: string;
}

export interface CreateTaskEvent extends BlocEvent {
  type: 'CREATE_TASK';
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
  category?: string;
}

export interface UpdateTaskEvent extends BlocEvent {
  type: 'UPDATE_TASK';
  task: Task;
}

export interface DeleteTaskEvent extends BlocEvent {
  type: 'DELETE_TASK';
  taskId: string;
}

export interface ToggleTaskCompletionEvent extends BlocEvent {
  type: 'TOGGLE_TASK_COMPLETION';
  taskId: string;
}

export interface FilterPriorityChangedEvent extends BlocEvent {
  type: 'FILTER_PRIORITY_CHANGED';
  priority: TaskPriorityFilter;
}

export interface FilterStatusChangedEvent extends BlocEvent {
  type: 'FILTER_STATUS_CHANGED';
  status: TaskStatusFilter;
}

export interface SearchQueryChangedEvent extends BlocEvent {
  type: 'SEARCH_QUERY_CHANGED';
  query: string;
}

export interface ClearTaskMessageEvent extends BlocEvent {
  type: 'CLEAR_TASK_MESSAGE';
}

export type TaskEvent =
  | LoadTasksEvent
  | CreateTaskEvent
  | UpdateTaskEvent
  | DeleteTaskEvent
  | ToggleTaskCompletionEvent
  | FilterPriorityChangedEvent
  | FilterStatusChangedEvent
  | SearchQueryChangedEvent
  | ClearTaskMessageEvent;
