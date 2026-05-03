import type { SignOptions } from 'jsonwebtoken';

export type LoginInput = {
  email: string;
  password: string;
};

export type AuthSession = {
  userId: number;
  email: string;
  name: string;
};

export type LoginResult = {
  token: string;
  session: AuthSession;
};

export const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-insecure-secret-change-me';
export const JWT_EXPIRES_IN: SignOptions['expiresIn'] =
  (process.env.JWT_EXPIRES_IN as SignOptions['expiresIn']) ?? '7d';
