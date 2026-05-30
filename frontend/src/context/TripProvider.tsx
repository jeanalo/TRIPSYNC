import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthProvider';
import { apiClient } from '../lib/apiClient';
import { createInviteLink } from '../services/invites.service';
import { fetchCountryByName, calculateTimeDifference } from '../services/api';
import { generateJetLagRecommendations } from '../services/jetlag.service';
import type { TripDetails, JetLagPlan } from '../types/travel.types';

interface BackendTrip {
  id: string;
  user_id: string;
  departure_country: string;
  destination_country: string;
  departure_date: string;
  arrival_date: string;
  budget: number;
  jet_lag_plan?: string | null;
}

interface TripContextType {
  tripDetails: TripDetails;
  setTripDetails: (details: TripDetails) => void;
  jetLagPlan: JetLagPlan | null;
  setJetLagPlan: (plan: JetLagPlan | null) => void;
  activeCity: string;
  setActiveCity: (city: string) => void;
  tripId: string | null;
  loading: boolean;
  shareTrip: () => Promise<string>;
  generateJetLagPlan: (departureTime: string, arrivalTime: string) => Promise<void>;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

const getKey = (key: string, email?: string) => (email ? `${email}:${key}` : key);

const defaultTripDetails: TripDetails = {
  departureCountry: '',
  destinationCountry: '',
  departureDate: '',
  arrivalDate: '',
  budget: 0,
  userIdOwner: '',
};


const TripProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  const tripIdRef = useRef<string | null>(null);
  const isLoadedRef = useRef(false);

  const [tripId, setTripIdState] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const setTripId = (id: string | null) => {
    tripIdRef.current = id;
    setTripIdState(id);
  };

  const [activeCity, setActiveCity] = useState(() =>
    localStorage.getItem(getKey('activeCity', user?.email)) || 'tokyo'
  );

  const [tripDetails, setTripDetailsState] = useState<TripDetails>(defaultTripDetails);
  const [jetLagPlan, setJetLagPlanState] = useState<JetLagPlan | null>(null);

  async function loadUserTrip() {
    setLoading(true);
    try {
      const data = await apiClient.get<BackendTrip | undefined>('/api/trips/me');
      if (data) {
        setTripId(data.id);
        setTripDetailsState({
          departureCountry: data.departure_country ?? '',
          destinationCountry: data.destination_country ?? '',
          departureDate: data.departure_date ?? '',
          arrivalDate: data.arrival_date ?? '',
          budget: Number(data.budget) || 0,
          userIdOwner: data.user_id,
        });
        if (data.jet_lag_plan) {
          try { setJetLagPlanState(JSON.parse(data.jet_lag_plan)); } catch { /* invalid JSON */ }
        }
      }
    } catch (err) {
      console.error('[TripProvider] Error loading trip:', err);
    }

    const savedActiveCity = localStorage.getItem(getKey('activeCity', user!.email));
    setActiveCity(savedActiveCity || 'tokyo');

    isLoadedRef.current = true;
    setLoading(false);
  }

  // Load trip from backend on user change
  useEffect(() => {
    if (!user?.id) {
      isLoadedRef.current = false;
      setTripId(null);
      setTripDetailsState(defaultTripDetails);
      setJetLagPlanState(null);
      return;
    }

    isLoadedRef.current = false;
    loadUserTrip();
  }, [user?.id]);

  async function syncTripDetailsToBackend() {
    try {
      const data = await apiClient.put<BackendTrip>('/api/trips/me', {
        id: tripIdRef.current ?? undefined,
        departure_country: tripDetails.departureCountry,
        destination_country: tripDetails.destinationCountry,
        departure_date: tripDetails.departureDate,
        arrival_date: tripDetails.arrivalDate,
        budget: tripDetails.budget,
      });
      if (!tripIdRef.current) setTripId(data.id);
    } catch (err) {
      console.error('Error syncing trip details:', err);
    }
  }

  // Sync trip details to backend
  useEffect(() => {
    if (!isLoadedRef.current || !user?.id) return;
    if (!tripDetails.departureCountry && !tripDetails.destinationCountry) return;
    syncTripDetailsToBackend();
  }, [tripDetails, user?.id]);

  async function syncJetLagPlanToBackend() {
    try {
      await apiClient.put<BackendTrip>('/api/trips/me', {
        id: tripIdRef.current,
        departure_country: tripDetails.departureCountry,
        destination_country: tripDetails.destinationCountry,
        departure_date: tripDetails.departureDate,
        arrival_date: tripDetails.arrivalDate,
        budget: tripDetails.budget,
        jet_lag_plan: jetLagPlan ? JSON.stringify(jetLagPlan) : null,
      });
    } catch (err) {
      console.error('Error syncing jet lag plan:', err);
    }
  }

  // Sync jet lag plan to backend
  useEffect(() => {
    if (!isLoadedRef.current || !user?.id || !tripIdRef.current) return;
    syncJetLagPlanToBackend();
  }, [jetLagPlan, user?.id]);

  useEffect(() => {
    if (user?.email) {
      localStorage.setItem(getKey('activeCity', user.email), activeCity);
    }
  }, [activeCity, user?.email]);

  const setTripDetails = (details: TripDetails) => setTripDetailsState(details);
  const setJetLagPlan = (plan: JetLagPlan | null) => setJetLagPlanState(plan);

  const shareTrip = async (): Promise<string> => {
    if (!tripIdRef.current) throw new Error('Set up your trip first before sharing it.');
    return createInviteLink(tripIdRef.current);
  };

  const generateJetLagPlan = async (departureTime: string, arrivalTime: string): Promise<void> => {
    const [departure, destination] = await Promise.all([
      fetchCountryByName(tripDetails.departureCountry),
      fetchCountryByName(tripDetails.destinationCountry),
    ]);
    const timeDiff =
      departure && destination
        ? calculateTimeDifference(departure.timezones[0], destination.timezones[0])
        : 0;
    const recs = generateJetLagRecommendations({
      departureTime,
      arrivalTime,
      timeDiff,
      destinationName: destination?.name || 'destination',
    });
    setJetLagPlanState({ departureTime, arrivalTime, recommendations: recs });
  };

  return (
    <TripContext.Provider
      value={{
        tripDetails,
        setTripDetails,
        jetLagPlan,
        setJetLagPlan,
        activeCity,
        setActiveCity,
        tripId,
        loading,
        shareTrip,
        generateJetLagPlan,
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export default TripProvider;

export const useTrip = () => {
  const context = useContext(TripContext);
  if (context === undefined) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
};
