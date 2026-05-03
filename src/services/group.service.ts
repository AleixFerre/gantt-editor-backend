import { groupRepository } from '../repositories/group.repository.ts';
import type {
  CreateGroupInput,
  ReorderInput,
  UpdateGroupInput,
} from './group.service.model.ts';

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

export const groupService = {
  listWithTasks(boardId: number) {
    return groupRepository.findAllWithTasks(boardId);
  },

  async create(input: CreateGroupInput) {
    const order = input.order ?? (await groupRepository.nextOrder(input.board));
    return groupRepository.create({
      name: input.name,
      color: input.color,
      order,
      boards: { connect: { id: input.board } },
    });
  },

  update(id: number, input: UpdateGroupInput) {
    return groupRepository.update(id, input);
  },

  reorder(input: ReorderInput) {
    const flat = flattenReorder(input);
    if (flat.length === 0) return Promise.resolve([]);
    return groupRepository.reorder(flat);
  },
};
