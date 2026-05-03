import type { Prisma, groups } from '@prisma/client';
import { prisma } from '../lib/prisma.ts';

export const groupRepository = {
  findAllWithTasks(boardId: number) {
    return prisma.groups.findMany({
      where: { board: boardId },
      orderBy: { order: 'asc' },
      include: { tasks: { orderBy: { order: 'asc' } } },
    });
  },

  create(data: Prisma.groupsCreateInput): Promise<groups> {
    return prisma.groups.create({ data });
  },

  update(id: number, data: Prisma.groupsUpdateInput): Promise<groups> {
    return prisma.groups.update({ where: { id }, data });
  },

  reorder(updates: ReadonlyArray<{ id: number; order: number }>) {
    return prisma.$transaction(
      updates.map(({ id, order }) =>
        prisma.groups.update({ where: { id }, data: { order } }),
      ),
    );
  },

  findById(id: number) {
    return prisma.groups.findUnique({ where: { id } });
  },

  deleteWithTasks(id: number) {
    return prisma.$transaction([
      prisma.tasks.deleteMany({ where: { group: id } }),
      prisma.groups.delete({ where: { id } }),
    ]);
  },

  async nextOrder(boardId: number): Promise<number> {
    const last = await prisma.groups.findFirst({
      where: { board: boardId },
      orderBy: { order: 'desc' },
      select: { order: true },
    });
    return last ? last.order + 1 : 0;
  },
};
