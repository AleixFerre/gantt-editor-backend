import type { Prisma, tasks } from '@prisma/client';
import { prisma } from '../lib/prisma.ts';

export const taskRepository = {
  create(data: Prisma.tasksCreateInput): Promise<tasks> {
    return prisma.tasks.create({ data });
  },
};
