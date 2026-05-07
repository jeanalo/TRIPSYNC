import app from './app';
import { config } from './config';

const startServer = () => {
  app.listen(config.port, () => {
    console.log(`TripSync backend running in ${config.nodeEnv} mode on port ${config.port}`);
  });
};

startServer();
