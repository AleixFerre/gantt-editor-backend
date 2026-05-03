import { boardRepository } from '../repositories/board.repository.ts';

export const boardService = {
  listForUser(userId: number) {
    return boardRepository.findAllForUser(userId);
  },

  userHasAccess(userId: number, boardId: number) {
    return boardRepository.userHasAccess(userId, boardId);
  },
};
