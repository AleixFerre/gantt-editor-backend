import type { Prisma, tasks } from '@prisma/client';
import { prisma } from '../lib/prisma.ts';

export const taskRepository = {
  create(data: Prisma.tasksCreateInput): Promise<tasks> {
    return prisma.tasks.create({ data });
  },

  update(id: number, data: Prisma.tasksUpdateInput): Promise<tasks> {
    return prisma.tasks.update({ where: { id }, data });
  },

  findById(id: number) {
    return prisma.tasks.findUnique({ where: { id } });
  },

  findByGroup(groupId: number): Promise<tasks[]> {
    return prisma.tasks.findMany({ where: { group: groupId } });
  },

  reorder(updates: ReadonlyArray<{ id: number; order: number }>) {
    return prisma.$transaction(
      updates.map(({ id, order }) =>
        prisma.tasks.update({ where: { id }, data: { order } }),
      ),
    );
  },

  async nextOrderForGroup(group: number | null): Promise<number> {
    const last = await prisma.tasks.findFirst({
      where: { group },
      orderBy: { order: 'desc' },
      select: { order: true },
    });
    return last ? last.order + 1 : 0;
  },
};
