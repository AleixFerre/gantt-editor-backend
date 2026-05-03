import { Router } from 'express';
import { boardController } from '../controllers/board.controller.ts';

export const boardRouter = Router();

boardRouter.get('/boards', boardController.list);
boardRouter.post('/boards', boardController.create);
boardRouter.patch('/boards/:id', boardController.update);
boardRouter.delete('/boards/:id', boardController.remove);
