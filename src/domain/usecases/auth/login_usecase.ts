import { Result } from '../../../core/utils/result';
import { AuthRepository } from '../../repositories/auth_repository';
import { User } from '../../entities/user.entity';
import { isValidEmail, isValidPassword } from '../../../core/utils/validator.utils';
import { ValidationFailure } from '../../../core/errors/failures';

export class LoginUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(email: string, password: string): Promise<Result<User>> {
    if (!isValidEmail(email)) {
      return Result.fail(new ValidationFailure('Please enter a valid email address.'));
    }
    if (!isValidPassword(password)) {
      return Result.fail(new ValidationFailure('Password must be at least 6 characters long.'));
    }
    return this.authRepository.login(email.trim(), password);
  }
}
