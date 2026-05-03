import type { Request, Response } from 'express';
import { realtimeBus } from '../realtime/bus.ts';
import { clientIdOf } from '../realtime/util.ts';
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
    res.status(201).json(board);
    realtimeBus.publishUserBoards(req.session.userId, {
      type: 'board.created',
      clientId: clientIdOf(req),
      board: { id: board.id, name: board.name },
    });
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
    res.json(updated);
    const userIds = await boardService.findUserIds(id);
    const clientId = clientIdOf(req);
    realtimeBus.publishUserBoardsMany(userIds, {
      type: 'board.updated',
      clientId,
      id,
      name: updated.name,
    });
  },

  async remove(req: Request, res: Response) {
    if (!req.session) return res.status(403).json({ error: 'Forbidden' });
    const id = Number(req.params['id']);
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'invalid id' });
    const allowed = await boardService.userHasAccess(req.session.userId, id);
    if (!allowed) return res.status(403).json({ error: 'Forbidden' });
    const userIds = await boardService.findUserIds(id);
    await boardService.deleteCascade(id);
    res.status(204).end();
    realtimeBus.publishUserBoardsMany(userIds, {
      type: 'board.deleted',
      clientId: clientIdOf(req),
      id,
    });
  },
};
