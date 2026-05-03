import type { groups, tasks } from '@prisma/client';

export type ApiTaskPayload = tasks;
export type ApiGroupPayload = groups & { tasks: tasks[] };

export type ReorderEntry = Record<string, number>;
export type ReorderBody = ReorderEntry[];

export type BoardEvent =
  | { type: 'group.created'; clientId: string | null; group: ApiGroupPayload }
  | {
      type: 'group.updated';
      clientId: string | null;
      id: number;
      changes: Partial<Pick<groups, 'name' | 'color' | 'order'>>;
    }
  | {
      type: 'group.deleted';
      clientId: string | null;
      id: number;
      deletedTaskIds: number[];
    }
  | { type: 'groups.reordered'; clientId: string | null; updates: ReorderBody }
  | { type: 'task.created'; clientId: string | null; task: ApiTaskPayload }
  | {
      type: 'task.updated';
      clientId: string | null;
      id: number;
      changes: Partial<
        Pick<tasks, 'name' | 'color' | 'order' | 'start' | 'duration' | 'group'>
      >;
    }
  | { type: 'tasks.reordered'; clientId: string | null; updates: ReorderBody };

export type UserBoardsEvent =
  | { type: 'board.created'; clientId: string | null; board: { id: number; name: string } }
  | { type: 'board.updated'; clientId: string | null; id: number; name: string }
  | { type: 'board.deleted'; clientId: string | null; id: number };

export const boardRoom = (boardId: number): string => `board:${boardId}`;
export const userBoardsRoom = (userId: number): string => `user:${userId}:boards`;
