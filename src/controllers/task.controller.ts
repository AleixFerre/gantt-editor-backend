import type { Request, Response } from 'express';
import {
  taskService,
  type CreateTaskInput,
  type UpdateTaskInput,
} from '../services/task.service.ts';

export const taskController = {
  async create(req: Request, res: Response) {
    const created = await taskService.create(req.body as CreateTaskInput);
    res.status(201).json(created);
  },

  async update(req: Request, res: Response) {
    const id = Number(req.params['id']);
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'invalid id' });
    const updated = await taskService.update(id, req.body as UpdateTaskInput);
    res.json(updated);
  },
};
