import type { Request, Response } from 'express';
import { authService } from '../services/auth.service.ts';
import type { LoginInput } from '../services/auth.service.model.ts';
import { AUTH_COOKIE_NAME } from '../middleware/auth.middleware.model.ts';
import { IS_PROD, SEVEN_DAYS_MS } from './auth.controller.model.ts';

export const authController = {
  async login(req: Request, res: Response) {
    const body = req.body as Partial<LoginInput>;
    if (!body?.email || !body?.password) {
      return res.status(400).json({ error: 'email and password are required' });
    }

    const result = await authService.login({
      email: body.email,
      password: body.password,
    });
    if (!result) return res.status(401).json({ error: 'Invalid credentials' });

    res.cookie(AUTH_COOKIE_NAME, result.token, {
      httpOnly: true,
      secure: IS_PROD,
      sameSite: IS_PROD ? 'none' : 'lax',
      maxAge: SEVEN_DAYS_MS,
      path: '/',
    });

    return res.json({ token: result.token, user: result.session });
  },

  logout(_req: Request, res: Response) {
    res.clearCookie(AUTH_COOKIE_NAME, {
      httpOnly: true,
      secure: IS_PROD,
      sameSite: IS_PROD ? 'none' : 'lax',
      path: '/',
    });
    res.status(204).end();
  },

  me(req: Request, res: Response) {
    if (!req.session) return res.status(403).json({ error: 'Forbidden' });
    res.json({ user: req.session });
  },
};
