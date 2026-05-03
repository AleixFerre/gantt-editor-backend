import { groupRepository } from '../repositories/group.repository.ts';

export type CreateGroupInput = {
  name: string;
  color: string;
  order?: number;
};

export type UpdateGroupInput = Partial<{
  name: string;
  color: string;
  order: number;
}>;

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
    });
  },

  update(id: number, input: UpdateGroupInput) {
    return groupRepository.update(id, input);
  },
};
