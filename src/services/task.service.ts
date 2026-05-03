import { taskRepository } from '../repositories/task.repository.ts';
import type { CreateTaskInput, UpdateTaskInput } from './task.service.model.ts';

export const taskService = {
  async create(input: CreateTaskInput) {
    const { group, order, ...rest } = input;
    const resolvedOrder = order ?? (await taskRepository.nextOrderForGroup(group ?? null));
    return taskRepository.create({
      ...rest,
      order: resolvedOrder,
      ...(group != null && { groups: { connect: { id: group } } }),
    });
  },

  update(id: number, input: UpdateTaskInput) {
    const { group, ...rest } = input;
    return taskRepository.update(id, {
      ...rest,
      ...(group !== undefined && {
        groups:
          group === null ? { disconnect: true } : { connect: { id: group } },
      }),
    });
  },
};
