import type { Prisma, tasks } from '@prisma/client';
import { prisma } from '../lib/prisma.ts';

export const taskRepository = {
  create(data: Prisma.tasksCreateInput): Promise<tasks> {
    return prisma.tasks.create({ data });
  },

  update(id: number, data: Prisma.tasksUpdateInput): Promise<tasks> {
    return prisma.tasks.update({ where: { id }, data });
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
