import { Bloc } from '../../../core/bloc/bloc.base';
import {
  TaskEvent,
  LoadTasksEvent,
  CreateTaskEvent,
  UpdateTaskEvent,
  DeleteTaskEvent,
  ToggleTaskCompletionEvent,
  FilterPriorityChangedEvent,
  FilterStatusChangedEvent,
  SearchQueryChangedEvent,
  ClearTaskMessageEvent,
} from './task_event';
import { TaskState } from './task_state';
import { GetTasksUseCase } from '../../../domain/usecases/task/get_tasks_usecase';
import { CreateTaskUseCase } from '../../../domain/usecases/task/create_task_usecase';
import { UpdateTaskUseCase } from '../../../domain/usecases/task/update_task_usecase';
import { DeleteTaskUseCase } from '../../../domain/usecases/task/delete_task_usecase';
import { ToggleTaskStatusUseCase } from '../../../domain/usecases/task/toggle_task_status_usecase';
import { Task, TaskFilterCriteria } from '../../../domain/entities/task.entity';
import { sortByDueDate } from '../../../core/utils/date.utils';

export class TaskBloc extends Bloc<TaskEvent, TaskState> {
  private currentUserId = 'default_user';

  constructor(
    private readonly getTasksUseCase: GetTasksUseCase,
    private readonly createTaskUseCase: CreateTaskUseCase,
    private readonly updateTaskUseCase: UpdateTaskUseCase,
    private readonly deleteTaskUseCase: DeleteTaskUseCase,
    private readonly toggleTaskStatusUseCase: ToggleTaskStatusUseCase
  ) {
    super(TaskState.initial());

    this.on<LoadTasksEvent>('LOAD_TASKS', this.handleLoadTasks.bind(this));
    this.on<CreateTaskEvent>('CREATE_TASK', this.handleCreateTask.bind(this));
    this.on<UpdateTaskEvent>('UPDATE_TASK', this.handleUpdateTask.bind(this));
    this.on<DeleteTaskEvent>('DELETE_TASK', this.handleDeleteTask.bind(this));
    this.on<ToggleTaskCompletionEvent>('TOGGLE_TASK_COMPLETION', this.handleToggleTaskCompletion.bind(this));
    this.on<FilterPriorityChangedEvent>('FILTER_PRIORITY_CHANGED', this.handleFilterPriorityChanged.bind(this));
    this.on<FilterStatusChangedEvent>('FILTER_STATUS_CHANGED', this.handleFilterStatusChanged.bind(this));
    this.on<SearchQueryChangedEvent>('SEARCH_QUERY_CHANGED', this.handleSearchQueryChanged.bind(this));
    this.on<ClearTaskMessageEvent>('CLEAR_TASK_MESSAGE', this.handleClearMessage.bind(this));
  }

  public setUserId(userId: string): void {
    this.currentUserId = userId;
  }

  private applyFilterAndSort(tasks: Task[], filter: TaskFilterCriteria): Task[] {
    let list = [...tasks];

    // Status filter (all, pending, completed)
    if (filter.status === 'pending') {
      list = list.filter((t) => !t.isCompleted);
    } else if (filter.status === 'completed') {
      list = list.filter((t) => t.isCompleted);
    }

    // Priority filter (all, low, medium, high)
    if (filter.priority !== 'all') {
      list = list.filter((t) => t.priority === filter.priority);
    }

    // Search query
    if (filter.searchQuery && filter.searchQuery.trim()) {
      const q = filter.searchQuery.trim().toLowerCase();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          (t.category && t.category.toLowerCase().includes(q))
      );
    }

    // Always sorted by due date (earliest to latest)
    return sortByDueDate(list);
  }

  private async handleLoadTasks(
    event: LoadTasksEvent,
    emit: (state: TaskState) => void
  ): Promise<void> {
    const userId = event.userId || this.currentUserId;
    this.currentUserId = userId;

    emit(TaskState.loading(this.state));

    const result = await this.getTasksUseCase.execute(userId);
    if (result.success) {
      const allTasks = result.data;
      const filtered = this.applyFilterAndSort(allTasks, this.state.filter);
      emit(TaskState.loaded(allTasks, filtered, this.state.filter));
    } else {
      emit(TaskState.error(result.error.message, this.state));
    }
  }

  private async handleCreateTask(
    event: CreateTaskEvent,
    emit: (state: TaskState) => void
  ): Promise<void> {
    const result = await this.createTaskUseCase.execute({
      title: event.title,
      description: event.description,
      dueDate: event.dueDate,
      priority: event.priority,
      category: event.category || 'General',
      isCompleted: false,
      userId: this.currentUserId,
    });

    if (result.success) {
      const allTasks = [result.data, ...this.state.allTasks];
      const filtered = this.applyFilterAndSort(allTasks, this.state.filter);
      emit(
        TaskState.loaded(
          allTasks,
          filtered,
          this.state.filter,
          'Task created successfully!'
        )
      );
    } else {
      emit(TaskState.error(result.error.message, this.state));
    }
  }

  private async handleUpdateTask(
    event: UpdateTaskEvent,
    emit: (state: TaskState) => void
  ): Promise<void> {
    const result = await this.updateTaskUseCase.execute(event.task);
    if (result.success) {
      const updated = result.data;
      const allTasks = this.state.allTasks.map((t) => (t.id === updated.id ? updated : t));
      const filtered = this.applyFilterAndSort(allTasks, this.state.filter);
      emit(
        TaskState.loaded(
          allTasks,
          filtered,
          this.state.filter,
          'Task updated successfully!'
        )
      );
    } else {
      emit(TaskState.error(result.error.message, this.state));
    }
  }

  private async handleDeleteTask(
    event: DeleteTaskEvent,
    emit: (state: TaskState) => void
  ): Promise<void> {
    const result = await this.deleteTaskUseCase.execute(event.taskId);
    if (result.success) {
      const allTasks = this.state.allTasks.filter((t) => t.id !== event.taskId);
      const filtered = this.applyFilterAndSort(allTasks, this.state.filter);
      emit(
        TaskState.loaded(
          allTasks,
          filtered,
          this.state.filter,
          'Task deleted successfully!'
        )
      );
    } else {
      emit(TaskState.error(result.error.message, this.state));
    }
  }

  private async handleToggleTaskCompletion(
    event: ToggleTaskCompletionEvent,
    emit: (state: TaskState) => void
  ): Promise<void> {
    const result = await this.toggleTaskStatusUseCase.execute(event.taskId);
    if (result.success) {
      const updated = result.data;
      const allTasks = this.state.allTasks.map((t) => (t.id === updated.id ? updated : t));
      const filtered = this.applyFilterAndSort(allTasks, this.state.filter);
      emit(TaskState.loaded(allTasks, filtered, this.state.filter));
    } else {
      emit(TaskState.error(result.error.message, this.state));
    }
  }

  private handleFilterPriorityChanged(
    event: FilterPriorityChangedEvent,
    emit: (state: TaskState) => void
  ): void {
    const newFilter: TaskFilterCriteria = {
      ...this.state.filter,
      priority: event.priority,
    };
    const filtered = this.applyFilterAndSort(this.state.allTasks, newFilter);
    emit(TaskState.loaded(this.state.allTasks, filtered, newFilter));
  }

  private handleFilterStatusChanged(
    event: FilterStatusChangedEvent,
    emit: (state: TaskState) => void
  ): void {
    const newFilter: TaskFilterCriteria = {
      ...this.state.filter,
      status: event.status,
    };
    const filtered = this.applyFilterAndSort(this.state.allTasks, newFilter);
    emit(TaskState.loaded(this.state.allTasks, filtered, newFilter));
  }

  private handleSearchQueryChanged(
    event: SearchQueryChangedEvent,
    emit: (state: TaskState) => void
  ): void {
    const newFilter: TaskFilterCriteria = {
      ...this.state.filter,
      searchQuery: event.query,
    };
    const filtered = this.applyFilterAndSort(this.state.allTasks, newFilter);
    emit(TaskState.loaded(this.state.allTasks, filtered, newFilter));
  }

  private handleClearMessage(
    _event: ClearTaskMessageEvent,
    emit: (state: TaskState) => void
  ): void {
    emit({
      ...this.state,
      errorMessage: undefined,
      actionSuccessMessage: undefined,
    });
  }
}
