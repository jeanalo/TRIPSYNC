import express from 'express';
import cors from 'cors';
import { CLIENT_URL } from './config';
import { apiRouter } from './routes';
import { errorsMiddleware } from './middlewares/errorsMiddleware';

const app = express();

app.use(cors({ origin: CLIENT_URL }));
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ status: 'ok', message: 'TripSync backend is running' });
});

app.use('/api', apiRouter);

app.use(errorsMiddleware);

export default app;
