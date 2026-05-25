import http from 'http';
import app from './app';
import { PORT, NODE_ENV } from './config';

const startServer = () => {
  const httpServer = http.createServer(app);

  httpServer.listen(PORT, () => {
    console.log(`Server URL: http://localhost:${PORT}`);
  });
};

startServer();
