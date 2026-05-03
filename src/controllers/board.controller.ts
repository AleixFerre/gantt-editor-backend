import type { Request, Response } from 'express';
import { boardService } from '../services/board.service.ts';

export const boardController = {
  async list(req: Request, res: Response) {
    if (!req.session) return res.status(403).json({ error: 'Forbidden' });
    const boards = await boardService.listForUser(req.session.userId);
    return res.json(boards);
  },
};
