import React, { createContext, useContext, useState, useEffect } from 'react';
import { socketService } from '../services/socket.service';
import { useTravel } from './TravelProvider';
import type { 
  RecommendationNotification, 
  RealtimeRecommendationPayload 
} from '../types/realtime.types';

interface RealtimeContextType {
  latestNotification: RecommendationNotification | null;
  clearNotification: () => void;
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined);

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const { activeCity } = useTravel();
  const [latestNotification, setLatestNotification] = useState<RecommendationNotification | null>(null);

  useEffect(() => {
    if (!activeCity) return;

    socketService.connect();
    socketService.joinCity(activeCity);

    const unsubscribe = socketService.onNewRecommendation((recommendation: RealtimeRecommendationPayload) => {
      const notification: RecommendationNotification = {
        id: Math.random().toString(36).substring(7),
        type: 'new-recommendation',
        city: activeCity,
        payload: recommendation,
        timestamp: new Date().toISOString(),
      };
      setLatestNotification(notification);
    });

    return () => {
      unsubscribe();
      socketService.leaveCity(activeCity);
    };
  }, [activeCity]);

  const clearNotification = () => {
    setLatestNotification(null);
  };

  return (
    <RealtimeContext.Provider value={{ latestNotification, clearNotification }}>
      {children}
    </RealtimeContext.Provider>
  );
}

export function useRealtime() {
  const context = useContext(RealtimeContext);
  if (context === undefined) {
    throw new Error('useRealtime must be used within a RealtimeProvider');
  }
  return context;
}
