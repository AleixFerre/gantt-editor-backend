import type { Request, Response } from 'express';
import { realtimeBus } from '../realtime/bus.ts';
import { boardIdForGroup, boardIdForTask, clientIdOf } from '../realtime/util.ts';
import { taskService } from '../services/task.service.ts';
import type {
  CreateTaskInput,
  ReorderInput,
  UpdateTaskInput,
} from '../services/task.service.model.ts';

export const taskController = {
  async create(req: Request, res: Response) {
    const body = req.body as CreateTaskInput;
    const created = await taskService.create(body);
    res.status(201).json(created);
    if (created.group != null) {
      const boardId = await boardIdForGroup(created.group);
      if (boardId !== null) {
        realtimeBus.publishBoard(boardId, {
          type: 'task.created',
          clientId: clientIdOf(req),
          task: created,
        });
      }
    }
  },

  async update(req: Request, res: Response) {
    const id = Number(req.params['id']);
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'invalid id' });
    const changes = req.body as UpdateTaskInput;
    const updated = await taskService.update(id, changes);
    res.json(updated);
    const boardId =
      updated.group != null ? await boardIdForGroup(updated.group) : null;
    if (boardId !== null) {
      realtimeBus.publishBoard(boardId, {
        type: 'task.updated',
        clientId: clientIdOf(req),
        id,
        changes,
      });
    }
  },

  async reorder(req: Request, res: Response) {
    const body = req.body as ReorderInput;
    if (!Array.isArray(body)) {
      return res.status(400).json({ error: 'expected an array' });
    }
    await taskService.reorder(body);
    res.status(204).end();
    const firstId = firstIdFromReorder(body);
    if (firstId !== null) {
      const boardId = await boardIdForTask(firstId);
      if (boardId !== null) {
        realtimeBus.publishBoard(boardId, {
          type: 'tasks.reordered',
          clientId: clientIdOf(req),
          updates: body,
        });
      }
    }
  },
};

const firstIdFromReorder = (body: ReorderInput): number | null => {
  for (const entry of body) {
    for (const key of Object.keys(entry)) {
      const id = Number(key);
      if (Number.isFinite(id)) return id;
    }
  }
  return null;
};
