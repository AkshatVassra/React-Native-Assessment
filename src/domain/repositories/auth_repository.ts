import { Result } from '../../core/utils/result';
import { User } from '../entities/user.entity';

export interface AuthRepository {
  login(email: string, password: string): Promise<Result<User>>;
  register(email: string, password: string): Promise<Result<User>>;
  logout(): Promise<Result<void>>;
  getCurrentUser(): Promise<Result<User | null>>;
}
