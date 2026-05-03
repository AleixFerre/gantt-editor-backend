import cors from 'cors';
import express from 'express';
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
app.use(express.json());
app.use(groupRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log(`🟢 Server listening on port ${port}`);
});
