import { taskRepository } from '../repositories/task.repository.ts';
import type {
  CreateTaskInput,
  ReorderInput,
  UpdateTaskInput,
} from './task.service.model.ts';

const flattenReorder = (input: ReorderInput): { id: number; order: number }[] => {
  const out: { id: number; order: number }[] = [];
  for (const entry of input) {
    for (const [k, v] of Object.entries(entry)) {
      const id = Number(k);
      if (Number.isFinite(id) && typeof v === 'number') {
        out.push({ id, order: v });
      }
    }
  }
  return out;
};

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

  reorder(input: ReorderInput) {
    const flat = flattenReorder(input);
    if (flat.length === 0) return Promise.resolve([]);
    return taskRepository.reorder(flat);
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
