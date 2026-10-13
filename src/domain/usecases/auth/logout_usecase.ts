import { Result } from '../../../core/utils/result';
import { AuthRepository } from '../../repositories/auth_repository';

export class LogoutUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(): Promise<Result<void>> {
    return this.authRepository.logout();
  }
}
