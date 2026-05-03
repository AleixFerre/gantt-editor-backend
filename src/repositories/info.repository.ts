import type { Info, Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma.ts';

export const infoRepository = {
  findFirst(): Promise<Info | null> {
    return prisma.info.findFirst({ orderBy: { id: 'asc' } });
  },

  update(id: number, data: Prisma.InfoUpdateInput): Promise<Info> {
    return prisma.info.update({ where: { id }, data });
  },

  create(data: Prisma.InfoCreateInput): Promise<Info> {
    return prisma.info.create({ data });
  },
};
