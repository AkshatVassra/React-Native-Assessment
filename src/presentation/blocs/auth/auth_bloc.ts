import { Bloc } from '../../../core/bloc/bloc.base';
import {
  AuthEvent,
  LoginRequestedEvent,
  RegisterRequestedEvent,
  CheckAuthStatusEvent,
} from './auth_event';
import { AuthState } from './auth_state';
import { LoginUseCase } from '../../../domain/usecases/auth/login_usecase';
import { RegisterUseCase } from '../../../domain/usecases/auth/register_usecase';
import { LogoutUseCase } from '../../../domain/usecases/auth/logout_usecase';
import { GetCurrentUserUseCase } from '../../../domain/usecases/auth/get_current_user_usecase';

export class AuthBloc extends Bloc<AuthEvent, AuthState> {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly getCurrentUserUseCase: GetCurrentUserUseCase
  ) {
    super(AuthState.initial());

    // Register event handlers
    this.on<CheckAuthStatusEvent>('CHECK_AUTH_STATUS', this.handleCheckAuthStatus.bind(this));
    this.on<LoginRequestedEvent>('LOGIN_REQUESTED', this.handleLoginRequested.bind(this));
    this.on<RegisterRequestedEvent>('REGISTER_REQUESTED', this.handleRegisterRequested.bind(this));
    this.on('LOGOUT_REQUESTED', this.handleLogoutRequested.bind(this));
    this.on('CLEAR_AUTH_ERROR', this.handleClearAuthError.bind(this));
  }

  private async handleCheckAuthStatus(
    _event: CheckAuthStatusEvent,
    emit: (state: AuthState) => void
  ): Promise<void> {
    emit(AuthState.loading());
    const result = await this.getCurrentUserUseCase.execute();
    if (result.success && result.data) {
      emit(AuthState.authenticated(result.data));
    } else {
      emit(AuthState.unauthenticated());
    }
  }

  private async handleLoginRequested(
    event: LoginRequestedEvent,
    emit: (state: AuthState) => void
  ): Promise<void> {
    emit(AuthState.loading());
    const result = await this.loginUseCase.execute(event.email, event.password);
    if (result.success) {
      emit(AuthState.authenticated(result.data));
    } else {
      emit(AuthState.error(result.error.message));
    }
  }

  private async handleRegisterRequested(
    event: RegisterRequestedEvent,
    emit: (state: AuthState) => void
  ): Promise<void> {
    emit(AuthState.loading());
    const result = await this.registerUseCase.execute(event.email, event.password);
    if (result.success) {
      emit(AuthState.authenticated(result.data));
    } else {
      emit(AuthState.error(result.error.message));
    }
  }

  private async handleLogoutRequested(
    _event: any,
    emit: (state: AuthState) => void
  ): Promise<void> {
    emit(AuthState.loading());
    await this.logoutUseCase.execute();
    emit(AuthState.unauthenticated());
  }

  private handleClearAuthError(_event: any, emit: (state: AuthState) => void): void {
    emit({
      ...this.state,
      errorMessage: undefined,
    });
  }
}
