import type { Request, Response } from 'express';
import {
  groupService,
  type CreateGroupInput,
  type UpdateGroupInput,
} from '../services/group.service.ts';

export const groupController = {
  async list(_req: Request, res: Response) {
    const groups = await groupService.listWithTasks();
    res.json(groups);
  },

  async create(req: Request, res: Response) {
    const created = await groupService.create(req.body as CreateGroupInput);
    res.status(201).json(created);
  },

  async update(req: Request, res: Response) {
    const id = Number(req.params['id']);
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'invalid id' });
    const updated = await groupService.update(id, req.body as UpdateGroupInput);
    res.json(updated);
  },
};
