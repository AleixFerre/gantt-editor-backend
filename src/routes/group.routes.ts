import { Router } from 'express';
import { groupController } from '../controllers/group.controller.ts';

export const groupRouter = Router();

groupRouter.get('/groups', groupController.list);
groupRouter.post('/groups', groupController.create);
groupRouter.patch('/groups/reorder', groupController.reorder);
groupRouter.patch('/groups/:id', groupController.update);
