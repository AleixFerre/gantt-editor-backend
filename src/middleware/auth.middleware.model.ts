import type { AuthSession } from '../services/auth.service.model.ts';

export const AUTH_COOKIE_NAME = 'auth_token';

declare global {
  namespace Express {
    interface Request {
      session?: AuthSession;
    }
  }
}
