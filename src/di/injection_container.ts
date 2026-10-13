import { TaskLocalDataSourceImpl, TaskLocalDataSource } from '../data/datasources/local/task_local_data_source';
import { AuthRemoteDataSourceImpl, AuthRemoteDataSource } from '../data/datasources/remote/auth_remote_data_source';
import { TaskRemoteDataSourceImpl, TaskRemoteDataSource } from '../data/datasources/remote/task_remote_data_source';
import { AuthRepositoryImpl } from '../data/repositories/auth_repository_impl';
import { TaskRepositoryImpl } from '../data/repositories/task_repository_impl';
import { AuthRepository } from '../domain/repositories/auth_repository';
import { TaskRepository } from '../domain/repositories/task_repository';
import { LoginUseCase } from '../domain/usecases/auth/login_usecase';
import { RegisterUseCase } from '../domain/usecases/auth/register_usecase';
import { LogoutUseCase } from '../domain/usecases/auth/logout_usecase';
import { GetCurrentUserUseCase } from '../domain/usecases/auth/get_current_user_usecase';
import { GetTasksUseCase } from '../domain/usecases/task/get_tasks_usecase';
import { CreateTaskUseCase } from '../domain/usecases/task/create_task_usecase';
import { UpdateTaskUseCase } from '../domain/usecases/task/update_task_usecase';
import { DeleteTaskUseCase } from '../domain/usecases/task/delete_task_usecase';
import { ToggleTaskStatusUseCase } from '../domain/usecases/task/toggle_task_status_usecase';
import { AuthBloc } from '../presentation/blocs/auth/auth_bloc';
import { TaskBloc } from '../presentation/blocs/task/task_bloc';

class InjectionContainer {
  // Data Sources
  public readonly localDataSource: TaskLocalDataSource;
  public readonly authRemoteDataSource: AuthRemoteDataSource;
  public readonly taskRemoteDataSource: TaskRemoteDataSource;

  // Repositories
  public readonly authRepository: AuthRepository;
  public readonly taskRepository: TaskRepository;

  // Use Cases - Auth
  public readonly loginUseCase: LoginUseCase;
  public readonly registerUseCase: RegisterUseCase;
  public readonly logoutUseCase: LogoutUseCase;
  public readonly getCurrentUserUseCase: GetCurrentUserUseCase;

  // Use Cases - Task
  public readonly getTasksUseCase: GetTasksUseCase;
  public readonly createTaskUseCase: CreateTaskUseCase;
  public readonly updateTaskUseCase: UpdateTaskUseCase;
  public readonly deleteTaskUseCase: DeleteTaskUseCase;
  public readonly toggleTaskStatusUseCase: ToggleTaskStatusUseCase;

  // BLoC Singletons
  private _authBloc?: AuthBloc;
  private _taskBloc?: TaskBloc;

  constructor() {
    // 1. Data Sources
    this.localDataSource = new TaskLocalDataSourceImpl();
    this.authRemoteDataSource = new AuthRemoteDataSourceImpl();
    this.taskRemoteDataSource = new TaskRemoteDataSourceImpl();

    // 2. Repositories
    this.authRepository = new AuthRepositoryImpl(
      this.authRemoteDataSource,
      this.localDataSource
    );
    this.taskRepository = new TaskRepositoryImpl(
      this.localDataSource,
      this.taskRemoteDataSource
    );

    // 3. Use Cases - Auth
    this.loginUseCase = new LoginUseCase(this.authRepository);
    this.registerUseCase = new RegisterUseCase(this.authRepository);
    this.logoutUseCase = new LogoutUseCase(this.authRepository);
    this.getCurrentUserUseCase = new GetCurrentUserUseCase(this.authRepository);

    // 4. Use Cases - Tasks
    this.getTasksUseCase = new GetTasksUseCase(this.taskRepository);
    this.createTaskUseCase = new CreateTaskUseCase(this.taskRepository);
    this.updateTaskUseCase = new UpdateTaskUseCase(this.taskRepository);
    this.deleteTaskUseCase = new DeleteTaskUseCase(this.taskRepository);
    this.toggleTaskStatusUseCase = new ToggleTaskStatusUseCase(this.taskRepository);
  }

  public getAuthBloc(): AuthBloc {
    if (!this._authBloc) {
      this._authBloc = new AuthBloc(
        this.loginUseCase,
        this.registerUseCase,
        this.logoutUseCase,
        this.getCurrentUserUseCase
      );
    }
    return this._authBloc;
  }

  public getTaskBloc(): TaskBloc {
    if (!this._taskBloc) {
      this._taskBloc = new TaskBloc(
        this.getTasksUseCase,
        this.createTaskUseCase,
        this.updateTaskUseCase,
        this.deleteTaskUseCase,
        this.toggleTaskStatusUseCase
      );
    }
    return this._taskBloc;
  }
}

export const sl = new InjectionContainer();
