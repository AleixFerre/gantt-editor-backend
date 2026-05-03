import { createHash } from 'node:crypto';
import jwt from 'jsonwebtoken';
import { userRepository } from '../repositories/user.repository.ts';
import {
  JWT_EXPIRES_IN,
  JWT_SECRET,
  type AuthSession,
  type LoginInput,
  type LoginResult,
} from './auth.service.model.ts';

const sha256 = (value: string): string =>
  createHash('sha256').update(value).digest('hex');

export const authService = {
  async login(input: LoginInput): Promise<LoginResult | null> {
    const user = await userRepository.findByEmail(input.email);
    if (!user) return null;
    if (sha256(input.password) !== user.password) return null;

    const session: AuthSession = {
      userId: user.id,
      email: user.email,
      name: user.name,
    };
    const token = jwt.sign(session, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    return { token, session };
  },

  verify(token: string): AuthSession | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as AuthSession & {
        iat?: number;
        exp?: number;
      };
      if (typeof decoded.userId !== 'number') return null;
      return {
        userId: decoded.userId,
        email: decoded.email,
        name: decoded.name,
      };
    } catch {
      return null;
    }
  },
};
