import type { Request, Response } from 'express';
import { boardService } from '../services/board.service.ts';

export const boardController = {
  async list(req: Request, res: Response) {
    if (!req.session) return res.status(403).json({ error: 'Forbidden' });
    const boards = await boardService.listForUser(req.session.userId);
    return res.json(boards);
  },

  async create(req: Request, res: Response) {
    if (!req.session) return res.status(403).json({ error: 'Forbidden' });
    const name = (req.body as { name?: unknown })?.name;
    if (typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'name is required' });
    }
    const board = await boardService.createForUser(req.session.userId, name.trim());
    return res.status(201).json(board);
  },
};
