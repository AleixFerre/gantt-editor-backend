import { Router } from 'express';
import { boardController } from '../controllers/board.controller.ts';

export const boardRouter = Router();

boardRouter.get('/boards', boardController.list);
