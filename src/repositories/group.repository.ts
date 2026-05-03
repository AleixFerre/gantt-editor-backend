import type { Prisma, groups } from '@prisma/client';
import { prisma } from '../lib/prisma.ts';

export const groupRepository = {
  findAllWithTasks() {
    return prisma.groups.findMany({
      orderBy: { order: 'asc' },
      include: { tasks: { orderBy: { order: 'asc' } } },
    });
  },

  create(data: Prisma.groupsCreateInput): Promise<groups> {
    return prisma.groups.create({ data });
  },

  async nextOrder(): Promise<number> {
    const last = await prisma.groups.findFirst({
      orderBy: { order: 'desc' },
      select: { order: true },
    });
    return last ? last.order + 1 : 0;
  },
};
