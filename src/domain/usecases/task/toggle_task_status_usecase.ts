import { Result } from '../../../core/utils/result';
import { TaskRepository } from '../../repositories/task_repository';
import { Task } from '../../entities/task.entity';
import { ValidationFailure } from '../../../core/errors/failures';

export class ToggleTaskStatusUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(taskId: string): Promise<Result<Task>> {
    if (!taskId) {
      return Result.fail(new ValidationFailure('Task ID must be provided.'));
    }
    return this.taskRepository.toggleTaskStatus(taskId);
  }
}
