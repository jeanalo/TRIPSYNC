import React, { createContext, useContext, useState, useEffect } from 'react';
import { realtimeService } from '../services/realtime.service';
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
  const { tripDetails } = useTravel();
  const activeCountry = tripDetails.destinationCountry;
  const [latestNotification, setLatestNotification] = useState<RecommendationNotification | null>(null);

  useEffect(() => {
    if (!activeCountry) return;

    const unsubscribe = realtimeService.subscribe(activeCountry, (recommendation: RealtimeRecommendationPayload) => {
      const notification: RecommendationNotification = {
        id: Math.random().toString(36).substring(7),
        type: 'new-recommendation',
        country: activeCountry,
        payload: recommendation,
        timestamp: new Date().toISOString(),
      };
      setLatestNotification(notification);
    });

    return () => unsubscribe();
  }, [activeCountry]);

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
