import http from 'http';
import { Server } from 'socket.io';
import app from './app';
import { config } from './config';
import { RealtimeRecommendation } from './shared/types';

const startServer = () => {
  const httpServer = http.createServer(app);
  
  const io = new Server(httpServer, {
    cors: {
      origin: config.clientUrl || '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    socket.on('join-city-room', (city: string) => {
      if (!city) return;
      const roomName = `recommendations:${city.toLowerCase().trim()}`;
      socket.join(roomName);
    });

    socket.on('leave-city-room', (city: string) => {
      if (!city) return;
      const roomName = `recommendations:${city.toLowerCase().trim()}`;
      socket.leave(roomName);
    });

    socket.on('admin-send-recommendation', (data: { city: string; recommendation: RealtimeRecommendation }) => {
      const { city, recommendation } = data;
      
      if (!city || !recommendation) {
        return;
      }
      
      const roomName = `recommendations:${city.toLowerCase().trim()}`;
      io.to(roomName).emit('new-city-recommendation', recommendation);
    });

    socket.on('disconnect', () => {
    });
  });

  httpServer.listen(config.port, () => {
    console.log(`TripSync backend running in ${config.nodeEnv} mode on port ${config.port}`);
  });
};

startServer();
