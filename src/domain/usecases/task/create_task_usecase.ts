import { Result } from '../../../core/utils/result';
import { TaskRepository } from '../../repositories/task_repository';
import { Task } from '../../entities/task.entity';
import { validateTaskInput } from '../../../core/utils/validator.utils';
import { ValidationFailure } from '../../../core/errors/failures';

export class CreateTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Result<Task>> {
    const validation = validateTaskInput(task.title, task.dueDate);
    if (!validation.isValid) {
      return Result.fail(new ValidationFailure(validation.error || 'Invalid task input.'));
    }
    return this.taskRepository.createTask(task);
  }
}
