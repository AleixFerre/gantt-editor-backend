import type { Request, Response } from 'express';
import { groupService, type CreateGroupInput } from '../services/group.service.ts';

export const groupController = {
  async list(_req: Request, res: Response) {
    const groups = await groupService.listWithTasks();
    res.json(groups);
  },

  async create(req: Request, res: Response) {
    const created = await groupService.create(req.body as CreateGroupInput);
    res.status(201).json(created);
  },
};
