import { taskRepository } from '../repositories/task.repository.ts';

export type CreateTaskInput = {
  name: string;
  color: string;
  start: number;
  duration: number;
  group?: number | null;
  order?: number;
};

export type UpdateTaskInput = Partial<{
  name: string;
  color: string;
  order: number;
  start: number;
  duration: number;
  group: number | null;
}>;

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
