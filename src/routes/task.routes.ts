import { Router } from 'express';
import { taskController } from '../controllers/task.controller.ts';

export const taskRouter = Router();

taskRouter.post('/tasks', taskController.create);
