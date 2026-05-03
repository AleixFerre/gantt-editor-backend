import express from 'express';
import { infoRouter } from './src/routes/info.routes.ts';

const app = express();
const port = Number(process.env.PORT ?? 3000);

app.use(express.json());
app.use(infoRouter);

app.listen(port, () => {
  console.log(`⚡ Server listening on port ${port}`);
});
