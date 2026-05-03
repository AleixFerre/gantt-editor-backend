import type { Request } from 'express';
import { groupService } from '../services/group.service.ts';
import { taskService } from '../services/task.service.ts';

export const clientIdOf = (req: Request): string | null => {
  const raw = req.headers['x-client-id'];
  if (typeof raw === 'string' && raw.length > 0) return raw;
  if (Array.isArray(raw) && raw.length > 0) return raw[0] ?? null;
  return null;
};

export const boardIdForGroup = async (groupId: number): Promise<number | null> => {
  const group = await groupService.findById(groupId);
  return group?.board ?? null;
};

export const boardIdForTask = async (taskId: number): Promise<number | null> => {
  const task = await taskService.findById(taskId);
  if (!task || task.group == null) return null;
  return boardIdForGroup(task.group);
};
