import type { Request, Response } from 'express';
import { realtimeBus } from '../realtime/bus.ts';
import { boardIdForGroup, clientIdOf } from '../realtime/util.ts';
import { boardService } from '../services/board.service.ts';
import type { CreateGroupInput, ReorderInput, UpdateGroupInput } from '../services/group.service.model.ts';
import { groupService } from '../services/group.service.ts';
import { taskService } from '../services/task.service.ts';

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
    res.status(201).json(created);
    realtimeBus.publishBoard(boardId, {
      type: 'group.created',
      clientId: clientIdOf(req),
      group: { ...created, tasks: [] },
    });
  },

  async update(req: Request, res: Response) {
    const id = Number(req.params['id']);
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'invalid id' });
    const changes = req.body as UpdateGroupInput;
    const updated = await groupService.update(id, changes);
    res.json(updated);
    const boardId = await boardIdForGroup(id);
    if (boardId !== null) {
      realtimeBus.publishBoard(boardId, {
        type: 'group.updated',
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
    await groupService.reorder(body);
    res.status(204).end();
    const firstId = firstIdFromReorder(body);
    if (firstId !== null) {
      const boardId = await boardIdForGroup(firstId);
      if (boardId !== null) {
        realtimeBus.publishBoard(boardId, {
          type: 'groups.reordered',
          clientId: clientIdOf(req),
          updates: body,
        });
      }
    }
  },

  async remove(req: Request, res: Response) {
    if (!req.session) return res.status(403).json({ error: 'Forbidden' });
    const id = Number(req.params['id']);
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'invalid id' });
    const group = await groupService.findById(id);
    if (!group) return res.status(404).json({ error: 'Not found' });
    const allowed = await boardService.userHasAccess(req.session.userId, group.board);
    if (!allowed) return res.status(403).json({ error: 'Forbidden' });
    const tasksInGroup = await taskService.listByGroup(id);
    await groupService.deleteWithTasks(id);
    res.status(204).end();
    realtimeBus.publishBoard(group.board, {
      type: 'group.deleted',
      clientId: clientIdOf(req),
      id,
      deletedTaskIds: tasksInGroup.map((t) => t.id),
    });
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
