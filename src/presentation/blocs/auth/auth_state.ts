import { BlocState } from '../../../core/bloc/bloc.base';
import { User } from '../../../domain/entities/user.entity';

export type AuthStatus = 'initial' | 'loading' | 'authenticated' | 'unauthenticated' | 'error';

export interface AuthState extends BlocState {
  status: AuthStatus;
  user: User | null;
  errorMessage?: string;
}

export const AuthState = {
  initial(): AuthState {
    return {
      status: 'initial',
      user: null,
    };
  },
  loading(): AuthState {
    return {
      status: 'loading',
      user: null,
    };
  },
  authenticated(user: User): AuthState {
    return {
      status: 'authenticated',
      user,
    };
  },
  unauthenticated(): AuthState {
    return {
      status: 'unauthenticated',
      user: null,
    };
  },
  error(errorMessage: string): AuthState {
    return {
      status: 'error',
      user: null,
      errorMessage,
    };
  },
};
