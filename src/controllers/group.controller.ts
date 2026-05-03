import type { Request, Response } from 'express';
import { boardService } from '../services/board.service.ts';
import { groupService } from '../services/group.service.ts';
import type {
  CreateGroupInput,
  ReorderInput,
  UpdateGroupInput,
} from '../services/group.service.model.ts';

export const groupController = {
  async list(req: Request, res: Response) {
    if (!req.session) return res.status(403).json({ error: 'Forbidden' });
    const boardId = Number(req.query['board']);
    if (!Number.isFinite(boardId)) {
      return res.status(400).json({ error: 'board query parameter is required' });
    }
    const allowed = await boardService.userHasAccess(req.session.userId, boardId);
    if (!allowed) return res.status(403).json({ error: 'Forbidden' });
    const groups = await groupService.listWithTasks(boardId);
    return res.json(groups);
  },

  async create(req: Request, res: Response) {
    if (!req.session) return res.status(403).json({ error: 'Forbidden' });
    const body = req.body as CreateGroupInput;
    const boardId = Number(body?.board);
    if (!Number.isFinite(boardId)) {
      return res.status(400).json({ error: 'board is required' });
    }
    const allowed = await boardService.userHasAccess(req.session.userId, boardId);
    if (!allowed) return res.status(403).json({ error: 'Forbidden' });
    const created = await groupService.create({ ...body, board: boardId });
    return res.status(201).json(created);
  },

  async update(req: Request, res: Response) {
    const id = Number(req.params['id']);
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'invalid id' });
    const updated = await groupService.update(id, req.body as UpdateGroupInput);
    return res.json(updated);
  },

  async reorder(req: Request, res: Response) {
    const body = req.body as ReorderInput;
    if (!Array.isArray(body)) {
      return res.status(400).json({ error: 'expected an array' });
    }
    await groupService.reorder(body);
    return res.status(204).end();
  },
};
