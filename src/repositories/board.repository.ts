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
};
