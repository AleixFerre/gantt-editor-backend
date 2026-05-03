import http from 'node:http';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import { Server as SocketIOServer } from 'socket.io';
import { authMiddleware } from './src/middleware/auth.middleware.ts';
import { realtimeBus } from './src/realtime/bus.ts';
import { attachRealtime } from './src/realtime/server.ts';
import { authRouter } from './src/routes/auth.routes.ts';
import { boardRouter } from './src/routes/board.routes.ts';
import { groupRouter } from './src/routes/group.routes.ts';
import { taskRouter } from './src/routes/task.routes.ts';

const app = express();
const port = Number(process.env.PORT ?? 3000);
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',');

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json());
app.use(cookieParser());

app.use(authRouter);
app.use(authMiddleware);
app.use(boardRouter);
app.use(groupRouter);
app.use(taskRouter);

const httpServer = http.createServer(app);
const io = new SocketIOServer(httpServer, {
  path: '/ws',
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});
attachRealtime(io);
realtimeBus.init(io);

httpServer.listen(port, () => {
  console.log(`🟢 Server listening on port ${port}`);
});
