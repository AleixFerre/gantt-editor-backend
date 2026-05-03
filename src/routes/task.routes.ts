import { Router } from 'express';
import { taskController } from '../controllers/task.controller.ts';

export const taskRouter = Router();

taskRouter.post('/tasks', taskController.create);
taskRouter.patch('/tasks/reorder', taskController.reorder);
taskRouter.patch('/tasks/:id', taskController.update);
