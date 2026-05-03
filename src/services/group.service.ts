import { groupRepository } from '../repositories/group.repository.ts';
import type { CreateGroupInput, UpdateGroupInput } from './group.service.model.ts';

export const groupService = {
  listWithTasks() {
    return groupRepository.findAllWithTasks();
  },

  async create(input: CreateGroupInput) {
    const order = input.order ?? (await groupRepository.nextOrder());
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
};
