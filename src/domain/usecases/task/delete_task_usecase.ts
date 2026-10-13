import { Result } from '../../../core/utils/result';
import { TaskRepository } from '../../repositories/task_repository';
import { ValidationFailure } from '../../../core/errors/failures';

export class DeleteTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(taskId: string): Promise<Result<void>> {
    if (!taskId) {
      return Result.fail(new ValidationFailure('Task ID must be provided.'));
    }
    return this.taskRepository.deleteTask(taskId);
  }
}
