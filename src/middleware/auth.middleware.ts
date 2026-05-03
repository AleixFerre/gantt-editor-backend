import type { NextFunction, Request, Response } from 'express';
import { userRepository } from '../repositories/user.repository.ts';
import { authService } from '../services/auth.service.ts';
import { AUTH_COOKIE_NAME } from './auth.middleware.model.ts';

const extractToken = (req: Request): string | null => {
  const cookieToken = (req as Request & { cookies?: Record<string, string> }).cookies?.[AUTH_COOKIE_NAME];
  if (cookieToken) return cookieToken;
  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) return header.slice('Bearer '.length);
  return null;
};

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const token = extractToken(req);
  if (!token) {
    res.status(403).json({ error: 'Forbidden' });
    return;
  }

  const session = authService.verify(token);
  if (!session) {
    res.status(403).json({ error: 'Forbidden' });
    return;
  }

  const user = await userRepository.findById(session.userId);
  if (!user) {
    res.status(403).json({ error: 'Forbidden' });
    return;
  }

  req.session = session;
  next();
};
