import { io, Socket } from 'socket.io-client';
import type { RealtimeRecommendationPayload } from '../types/realtime.types';

class SocketService {
  private socket: Socket | null = null;
  private url: string;

  constructor() {
    this.url = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000';
  }

  public connect(): void {
    if (!this.socket) {
      this.socket = io(this.url);
    }
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  public joinCity(city: string): void {
    if (this.socket && city) {
      this.socket.emit('join-city-room', city);
    }
  }

  public leaveCity(city: string): void {
    if (this.socket && city) {
      this.socket.emit('leave-city-room', city);
    }
  }

  public sendAdminRecommendation(city: string, recommendation: RealtimeRecommendationPayload): void {
    if (this.socket && city && recommendation) {
      this.socket.emit('admin-send-recommendation', { city, recommendation });
    }
  }

  public onNewRecommendation(callback: (recommendation: RealtimeRecommendationPayload) => void): () => void {
    if (this.socket) {
      this.socket.on('new-city-recommendation', callback);
      return () => {
        this.socket?.off('new-city-recommendation', callback);
      };
    }
    return () => {};
  }
}

export const socketService = new SocketService();
