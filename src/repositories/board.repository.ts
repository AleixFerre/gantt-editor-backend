import { prisma } from '../lib/prisma.ts';

export const boardRepository = {
  findAllForUser(userId: number) {
    return prisma.boards.findMany({
      where: { user_boards: { some: { user: userId } } },
      orderBy: { id: 'asc' },
    });
  },

  async userHasAccess(userId: number, boardId: number): Promise<boolean> {
    const row = await prisma.user_boards.findFirst({
      where: { user: userId, board: boardId },
    });
    return row !== null;
  },

  createForUser(userId: number, name: string) {
    return prisma.boards.create({
      data: {
        name,
        user_boards: { create: { users: { connect: { id: userId } } } },
      },
    });
  },

  update(id: number, name: string) {
    return prisma.boards.update({ where: { id }, data: { name } });
  },

  async findUserIds(boardId: number): Promise<number[]> {
    const rows = await prisma.user_boards.findMany({
      where: { board: boardId },
      select: { user: true },
    });
    return rows.map((r) => r.user);
  },

  deleteCascade(id: number) {
    return prisma.$transaction([
      prisma.tasks.deleteMany({ where: { groups: { board: id } } }),
      prisma.groups.deleteMany({ where: { board: id } }),
      prisma.user_boards.deleteMany({ where: { board: id } }),
      prisma.boards.delete({ where: { id } }),
    ]);
  },
};
