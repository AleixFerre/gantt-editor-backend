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

  async update(req: Request, res: Response) {
    if (!req.session) return res.status(403).json({ error: 'Forbidden' });
    const id = Number(req.params['id']);
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'invalid id' });
    const allowed = await boardService.userHasAccess(req.session.userId, id);
    if (!allowed) return res.status(403).json({ error: 'Forbidden' });
    const name = (req.body as { name?: unknown })?.name;
    if (typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'name is required' });
    }
    const updated = await boardService.update(id, name.trim());
    return res.json(updated);
  },

  async remove(req: Request, res: Response) {
    if (!req.session) return res.status(403).json({ error: 'Forbidden' });
    const id = Number(req.params['id']);
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'invalid id' });
    const allowed = await boardService.userHasAccess(req.session.userId, id);
    if (!allowed) return res.status(403).json({ error: 'Forbidden' });
    await boardService.deleteCascade(id);
    return res.status(204).end();
  },
};
