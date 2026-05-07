import express from 'express';
import cors from 'cors';
import { config } from './config';
import { apiRouter } from './routes';

const app = express();

app.use(cors({ origin: config.clientUrl }));
app.use(express.json());

app.use('/api', apiRouter);

export default app;
