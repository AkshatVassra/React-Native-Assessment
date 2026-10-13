import { Result } from '../../../core/utils/result';
import { TaskRepository } from '../../repositories/task_repository';
import { Task } from '../../entities/task.entity';
import { sortByDueDate } from '../../../core/utils/date.utils';

export class GetTasksUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(userId: string): Promise<Result<Task[]>> {
    const result = await this.taskRepository.getTasks(userId);
    if (!result.success) {
      return result;
    }
    // Sort tasks by due date (earliest to latest) as required
    const sorted = sortByDueDate(result.data);
    return Result.ok(sorted);
  }
}
