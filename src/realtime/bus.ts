import type { Server } from 'socket.io';
import {
  boardRoom,
  userBoardsRoom,
  type BoardEvent,
  type UserBoardsEvent,
} from './events.ts';

let io: Server | null = null;

export const realtimeBus = {
  init(server: Server): void {
    io = server;
  },

  publishBoard(boardId: number, event: BoardEvent): void {
    if (!io) return;
    try {
      io.to(boardRoom(boardId)).emit(event.type, event);
    } catch (err) {
      console.error('[realtime] publishBoard failed', err);
    }
  },

  publishUserBoards(userId: number, event: UserBoardsEvent): void {
    if (!io) return;
    try {
      io.to(userBoardsRoom(userId)).emit(event.type, event);
    } catch (err) {
      console.error('[realtime] publishUserBoards failed', err);
    }
  },

  publishUserBoardsMany(userIds: ReadonlyArray<number>, event: UserBoardsEvent): void {
    if (!io) return;
    for (const userId of userIds) this.publishUserBoards(userId, event);
  },
};
