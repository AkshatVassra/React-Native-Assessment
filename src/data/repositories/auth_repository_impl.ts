import { AuthRepository } from '../../domain/repositories/auth_repository';
import { User } from '../../domain/entities/user.entity';
import { Result } from '../../core/utils/result';
import { Failure, AuthFailure } from '../../core/errors/failures';
import { AuthRemoteDataSource } from '../datasources/remote/auth_remote_data_source';
import { TaskLocalDataSource } from '../datasources/local/task_local_data_source';

export class AuthRepositoryImpl implements AuthRepository {
  constructor(
    private readonly remoteDataSource: AuthRemoteDataSource,
    private readonly localDataSource: TaskLocalDataSource
  ) {}

  async login(email: string, password: string): Promise<Result<User>> {
    try {
      const userModel = await this.remoteDataSource.login(email, password);
      await this.localDataSource.saveUserSession(userModel);
      return Result.ok(userModel.toEntity());
    } catch (error: any) {
      if (error instanceof Failure) {
        return Result.fail(error);
      }
      return Result.fail(new AuthFailure(error?.message || 'Login failed.'));
    }
  }

  async register(email: string, password: string): Promise<Result<User>> {
    try {
      const userModel = await this.remoteDataSource.register(email, password);
      await this.localDataSource.saveUserSession(userModel);
      return Result.ok(userModel.toEntity());
    } catch (error: any) {
      if (error instanceof Failure) {
        return Result.fail(error);
      }
      return Result.fail(new AuthFailure(error?.message || 'Registration failed.'));
    }
  }

  async logout(): Promise<Result<void>> {
    try {
      await this.localDataSource.clearUserSession();
      return Result.ok(undefined);
    } catch (error: any) {
      return Result.fail(new AuthFailure('Failed to log out.'));
    }
  }

  async getCurrentUser(): Promise<Result<User | null>> {
    try {
      const session = await this.localDataSource.getUserSession();
      if (!session) {
        return Result.ok(null);
      }
      return Result.ok(session.toEntity());
    } catch (error: any) {
      return Result.ok(null);
    }
  }
}
