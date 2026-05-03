import { taskRepository } from '../repositories/task.repository.ts';

export type CreateTaskInput = {
  name: string;
  color: string;
  order: number;
  start: number;
  duration: number;
  group?: number | null;
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
  create(input: CreateTaskInput) {
    const { group, ...rest } = input;
    return taskRepository.create({
      ...rest,
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
