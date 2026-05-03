import type { Request, Response } from 'express';
import { taskService, type CreateTaskInput } from '../services/task.service.ts';

export const taskController = {
  async create(req: Request, res: Response) {
    const created = await taskService.create(req.body as CreateTaskInput);
    res.status(201).json(created);
  },
};
