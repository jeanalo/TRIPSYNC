import http from 'http';
import app from './app';
import { PORT, NODE_ENV } from './config';

const startServer = () => {
  const httpServer = http.createServer(app);

  httpServer.listen(PORT, () => {
    console.log(`TripSync backend running in ${NODE_ENV} mode on port ${PORT}`);
  });
};

startServer();
