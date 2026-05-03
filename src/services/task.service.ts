import { taskRepository } from '../repositories/task.repository.ts';

export type CreateTaskInput = {
  name: string;
  color: string;
  order: number;
  group?: number | null;
};

export const taskService = {
  create(input: CreateTaskInput) {
    const { group, ...rest } = input;
    return taskRepository.create({
      ...rest,
      ...(group != null && { groups: { connect: { id: group } } }),
    });
  },
};
