import { Router } from 'express';
import { authController } from '../controllers/auth.controller.ts';
import { authMiddleware } from '../middleware/auth.middleware.ts';

export const authRouter = Router();

authRouter.post('/auth/login', authController.login);
authRouter.post('/auth/logout', authController.logout);
authRouter.get('/auth/me', authMiddleware, authController.me);
