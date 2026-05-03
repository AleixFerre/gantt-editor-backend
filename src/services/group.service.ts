import { groupRepository } from '../repositories/group.repository.ts';

export type CreateGroupInput = {
  name: string;
  color: string;
  order: number;
};

export const groupService = {
  listWithTasks() {
    return groupRepository.findAllWithTasks();
  },

  create(input: CreateGroupInput) {
    return groupRepository.create(input);
  },
};
