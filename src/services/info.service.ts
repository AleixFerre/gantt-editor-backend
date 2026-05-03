import type { Info } from '@prisma/client';
import { infoRepository } from '../repositories/info.repository.ts';

export type InfoChange = Partial<{
  title: string;
  description: string | null;
  startDate: string | null;
  endDate: string | null;
  progress: number;
}>;

export const infoService = {
  get(): Promise<Info | null> {
    return infoRepository.findFirst();
  },

  async change(input: InfoChange): Promise<Info> {
    const data = {
      ...(input.title !== undefined && { title: input.title }),
      ...(input.description !== undefined && { description: input.description }),
      ...(input.startDate !== undefined && {
        startDate: input.startDate ? new Date(input.startDate) : null,
      }),
      ...(input.endDate !== undefined && {
        endDate: input.endDate ? new Date(input.endDate) : null,
      }),
      ...(input.progress !== undefined && { progress: input.progress }),
    };

    const existing = await infoRepository.findFirst();
    if (existing) return infoRepository.update(existing.id, data);
    return infoRepository.create({ title: data.title ?? 'Untitled', ...data });
  },
};
