import type { Server, Socket } from 'socket.io';
import { AUTH_COOKIE_NAME } from '../middleware/auth.middleware.model.ts';
import { userRepository } from '../repositories/user.repository.ts';
import { authService } from '../services/auth.service.ts';
import { boardService } from '../services/board.service.ts';
import { userBoardsRoom } from './events.ts';

interface SocketData {
  userId: number;
  email: string;
  name: string;
  clientId: string | null;
}

type AppSocket = Socket<Record<string, unknown>, Record<string, unknown>, Record<string, unknown>, SocketData>;

const parseCookies = (header: string | undefined): Record<string, string> => {
  if (!header) return {};
  const out: Record<string, string> = {};
  for (const part of header.split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim();
    if (!key) continue;
    const raw = part.slice(idx + 1).trim();
    const value = raw.startsWith('"') && raw.endsWith('"') ? raw.slice(1, -1) : raw;
    try {
      out[key] = decodeURIComponent(value);
    } catch {
      out[key] = value;
    }
  }
  return out;
};

const extractToken = (socket: Socket): string | null => {
  const cookies = parseCookies(socket.handshake.headers.cookie);
  const fromCookie = cookies[AUTH_COOKIE_NAME];
  if (fromCookie) return fromCookie;
  const auth = socket.handshake.auth as { token?: unknown } | undefined;
  if (auth && typeof auth.token === 'string' && auth.token.length > 0) return auth.token;
  return null;
};

export const attachRealtime = (io: Server): void => {
  io.use(async (socket, next) => {
    try {
      const token = extractToken(socket);
      if (!token) return next(new Error('Forbidden'));
      const session = authService.verify(token);
      if (!session) return next(new Error('Forbidden'));
      const user = await userRepository.findById(session.userId);
      if (!user) return next(new Error('Forbidden'));

      const queryClientId = socket.handshake.query['clientId'];
      const clientId = typeof queryClientId === 'string' && queryClientId.length > 0
        ? queryClientId
        : null;

      const data = socket.data as SocketData;
      data.userId = session.userId;
      data.email = session.email;
      data.name = session.name;
      data.clientId = clientId;
      next();
    } catch (err) {
      console.error('[realtime] auth error', err);
      next(new Error('Forbidden'));
    }
  });

  io.on('connection', (socket: AppSocket) => {
    const userId = socket.data.userId;
    socket.join(userBoardsRoom(userId));

    socket.on(
      'subscribe',
      async (
        payload: { boardId?: unknown },
        ack?: (response: { ok: boolean; code?: string }) => void,
      ) => {
        const boardId = Number(payload?.boardId);
        if (!Number.isFinite(boardId)) {
          ack?.({ ok: false, code: 'invalid' });
          return;
        }
        try {
          const allowed = await boardService.userHasAccess(userId, boardId);
          if (!allowed) {
            ack?.({ ok: false, code: 'forbidden' });
            return;
          }
          socket.join(`board:${boardId}`);
          ack?.({ ok: true });
        } catch (err) {
          console.error('[realtime] subscribe error', err);
          ack?.({ ok: false, code: 'error' });
        }
      },
    );

    socket.on('unsubscribe', (payload: { boardId?: unknown }) => {
      const boardId = Number(payload?.boardId);
      if (!Number.isFinite(boardId)) return;
      socket.leave(`board:${boardId}`);
    });
  });
};
