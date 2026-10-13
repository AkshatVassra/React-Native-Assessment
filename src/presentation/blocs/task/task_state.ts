import { BlocState } from '../../../core/bloc/bloc.base';
import {
  Task,
  TaskFilterCriteria,
  TaskPriorityFilter,
  TaskStatusFilter,
} from '../../../domain/entities/task.entity';

export type TaskStatus = 'initial' | 'loading' | 'loaded' | 'error';

export interface TaskState extends BlocState {
  status: TaskStatus;
  allTasks: Task[];
  filteredTasks: Task[];
  filter: TaskFilterCriteria;
  errorMessage?: string;
  actionSuccessMessage?: string;
}

export const defaultTaskFilter: TaskFilterCriteria = {
  priority: 'all',
  status: 'all',
  searchQuery: '',
};

export const TaskState = {
  initial(): TaskState {
    return {
      status: 'initial',
      allTasks: [],
      filteredTasks: [],
      filter: { ...defaultTaskFilter },
    };
  },
  loading(current?: Partial<TaskState>): TaskState {
    return {
      status: 'loading',
      allTasks: current?.allTasks || [],
      filteredTasks: current?.filteredTasks || [],
      filter: current?.filter || { ...defaultTaskFilter },
    };
  },
  loaded(
    allTasks: Task[],
    filteredTasks: Task[],
    filter: TaskFilterCriteria,
    actionSuccessMessage?: string
  ): TaskState {
    return {
      status: 'loaded',
      allTasks,
      filteredTasks,
      filter,
      actionSuccessMessage,
    };
  },
  error(
    errorMessage: string,
    current?: Partial<TaskState>
  ): TaskState {
    return {
      status: 'error',
      allTasks: current?.allTasks || [],
      filteredTasks: current?.filteredTasks || [],
      filter: current?.filter || { ...defaultTaskFilter },
      errorMessage,
    };
  },
};
