import type { users } from '@prisma/client';
import { prisma } from '../lib/prisma.ts';

export const userRepository = {
  findByEmail(email: string): Promise<users | null> {
    return prisma.users.findFirst({ where: { email } });
  },

  findById(id: number): Promise<users | null> {
    return prisma.users.findUnique({ where: { id } });
  },
};
