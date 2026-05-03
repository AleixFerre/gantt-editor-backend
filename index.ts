import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import { authMiddleware } from './src/middleware/auth.middleware.ts';
import { authRouter } from './src/routes/auth.routes.ts';
import { boardRouter } from './src/routes/board.routes.ts';
import { groupRouter } from './src/routes/group.routes.ts';
import { taskRouter } from './src/routes/task.routes.ts';

const app = express();
const port = Number(process.env.PORT ?? 3000);

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(','),
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

app.listen(port, () => {
  console.log(`🟢 Server listening on port ${port}`);
});
