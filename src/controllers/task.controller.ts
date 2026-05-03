import type { Request, Response } from 'express';
import { taskService } from '../services/task.service.ts';
import type {
  CreateTaskInput,
  ReorderInput,
  UpdateTaskInput,
} from '../services/task.service.model.ts';

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

  async reorder(req: Request, res: Response) {
    const body = req.body as ReorderInput;
    if (!Array.isArray(body)) {
      return res.status(400).json({ error: 'expected an array' });
    }
    await taskService.reorder(body);
    return res.status(204).end();
  },
};
