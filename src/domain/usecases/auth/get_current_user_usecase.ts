import { Result } from '../../../core/utils/result';
import { AuthRepository } from '../../repositories/auth_repository';
import { User } from '../../entities/user.entity';

export class GetCurrentUserUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(): Promise<Result<User | null>> {
    return this.authRepository.getCurrentUser();
  }
}
