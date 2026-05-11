import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthProvider';
import { supabase } from '../lib/supabase';
import type {
  Expense,
  Activity,
  Experience,
  TripDetails,
  JetLagPlan
} from '../types/travel.types';

interface TravelContextType {
  tripDetails: TripDetails;
  setTripDetails: (details: TripDetails) => void;
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  activities: Activity[];
  addActivity: (activity: Omit<Activity, 'id'>) => Promise<void>;
  deleteActivity: (id: string) => Promise<void>;
  experiences: Experience[];
  toggleSaveExperience: (id: string) => void;
  jetLagPlan: JetLagPlan | null;
  setJetLagPlan: (plan: JetLagPlan | null) => void;
  activeCity: string;
  setActiveCity: (city: string) => void;
}

const TravelContext = createContext<TravelContextType | undefined>(undefined);

const getKey = (key: string, email?: string) => (email ? `${email}:${key}` : key);

const defaultTripDetails: TripDetails = {
  departureCountry: '',
  destinationCountry: '',
  departureDate: '',
  arrivalDate: '',
  budget: 0,
};

const defaultExperiences: Experience[] = [
  {
    id: '1',
    title: 'Sunset Kayaking',
    location: 'Blue Bay',
    category: 'Adventure',
    image: 'https://images.unsplash.com/photo-1595368062405-e4d7840cba14?w=600&q=80',
    saved: false,
  },
  {
    id: '2',
    title: 'Ancient Temple Visit',
    location: 'Old Town',
    category: 'Cultural',
    image: 'https://images.unsplash.com/photo-1598177183224-b3cec6da6b04?w=600&q=80',
    saved: true,
  },
  {
    id: '3',
    title: 'Street Food Tour',
    location: 'Night Market',
    category: 'Chill',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80',
    saved: false,
  },
  {
    id: '4',
    title: 'Hidden Waterfall Hike',
    location: 'National Park',
    category: 'Free Tour',
    image: 'https://images.unsplash.com/photo-1594671733084-66a82cc4304a?w=600&q=80',
    saved: false,
  },
];

export function TravelProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  const tripIdRef = useRef<string | null>(null);
  const isLoadedRef = useRef(false);

  const [activeCity, setActiveCity] = useState(() =>
    localStorage.getItem(getKey('activeCity', user?.email)) || 'tokyo'
  );

  const [tripDetails, setTripDetailsState] = useState<TripDetails>(defaultTripDetails);

  const [expenses, setExpenses] = useState<Expense[]>([]);

  const [activities, setActivities] = useState<Activity[]>([]);

  const [experiences, setExperiences] = useState<Experience[]>(() => {
    const saved = localStorage.getItem(getKey('experiences', user?.email));
    return saved ? JSON.parse(saved) : defaultExperiences;
  });

  const [jetLagPlan, setJetLagPlanState] = useState<JetLagPlan | null>(null);

  // Load trip + jet lag plan from Supabase on user change
  useEffect(() => {
    if (!user?.id) {
      isLoadedRef.current = false;
      tripIdRef.current = null;
      setTripDetailsState(defaultTripDetails);
      setJetLagPlanState(null);
      return;
    }

    isLoadedRef.current = false;

    (async () => {
      const { data } = await supabase
        .from('trips')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (data) {
        tripIdRef.current = data.id;
        setTripDetailsState({
          departureCountry: data.departure_country ?? '',
          destinationCountry: data.destination_country ?? '',
          departureDate: data.departure_date ?? '',
          arrivalDate: data.arrival_date ?? '',
          budget: Number(data.budget) || 0,
        });
        if (data.jet_lag_plan) {
          try { setJetLagPlanState(JSON.parse(data.jet_lag_plan)); } catch { /* invalid JSON */ }
        }
      } else {
        // Migration: use localStorage data if available
        const saved = localStorage.getItem(getKey('tripDetails', user.email));
        if (saved) {
          const parsed = JSON.parse(saved);
          setTripDetailsState({ ...parsed, budget: Number(parsed.budget) || 0 });
        }
        const savedJetLag = localStorage.getItem(getKey('jetLagPlan', user.email));
        if (savedJetLag) {
          try { setJetLagPlanState(JSON.parse(savedJetLag)); } catch { /* invalid JSON */ }
        }
      }

      const { data: expenseRows } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id);
      setExpenses((expenseRows ?? []).map((e) => ({
        id: e.id,
        amount: Number(e.amount) || 0,
        category: e.category,
        date: e.date,
        notes: e.notes ?? '',
      })));

      const { data: activityRows } = await supabase
        .from('activities')
        .select('*')
        .eq('user_id', user.id);
      setActivities((activityRows ?? []).map((a) => ({
        id: a.id,
        name: a.name,
        date: a.date,
        time: a.time,
        location: a.location ?? '',
        category: a.category,
        notes: a.notes ?? '',
      })));

      const savedExperiences = localStorage.getItem(getKey('experiences', user.email));
      setExperiences(savedExperiences ? JSON.parse(savedExperiences) : defaultExperiences);

      const savedActiveCity = localStorage.getItem(getKey('activeCity', user.email));
      setActiveCity(savedActiveCity || 'tokyo');

      isLoadedRef.current = true;
    })();
  }, [user?.id]);

  // Sync trip details to Supabase
  useEffect(() => {
    if (!isLoadedRef.current || !user?.id) return;
    if (!tripDetails.departureCountry && !tripDetails.destinationCountry) return;

    (async () => {
      if (tripIdRef.current) {
        await supabase
          .from('trips')
          .update({
            departure_country: tripDetails.departureCountry,
            destination_country: tripDetails.destinationCountry,
            departure_date: tripDetails.departureDate,
            arrival_date: tripDetails.arrivalDate,
            budget: String(tripDetails.budget),
          })
          .eq('id', tripIdRef.current);
      } else {
        const id = crypto.randomUUID();
        tripIdRef.current = id;
        await supabase.from('trips').insert({
          id,
          user_id: user.id,
          departure_country: tripDetails.departureCountry,
          destination_country: tripDetails.destinationCountry,
          departure_date: tripDetails.departureDate,
          arrival_date: tripDetails.arrivalDate,
          budget: String(tripDetails.budget),
          created_at: new Date().toISOString(),
        });
      }
    })();
  }, [tripDetails, user?.id]);

  // Sync jet lag plan to Supabase
  useEffect(() => {
    if (!isLoadedRef.current || !user?.id || !tripIdRef.current) return;

    (async () => {
      await supabase
        .from('trips')
        .update({ jet_lag_plan: jetLagPlan ? JSON.stringify(jetLagPlan) : null })
        .eq('id', tripIdRef.current!);
    })();
  }, [jetLagPlan, user?.id]);



  useEffect(() => {
    if (user?.email) {
      localStorage.setItem(getKey('experiences', user.email), JSON.stringify(experiences));
    }
  }, [experiences, user?.email]);

  useEffect(() => {
    if (user?.email) {
      localStorage.setItem(getKey('activeCity', user.email), activeCity);
    }
  }, [activeCity, user?.email]);

  const setTripDetails = (details: TripDetails) => setTripDetailsState(details);
  const setJetLagPlan = (plan: JetLagPlan | null) => setJetLagPlanState(plan);

  const addExpense = async (expense: Omit<Expense, 'id'>) => {
    const id = crypto.randomUUID();
    const { error } = await supabase.from('expenses').insert({
      id,
      trip_id: tripIdRef.current ?? null,
      user_id: user?.id,
      amount: expense.amount,
      category: expense.category,
      date: expense.date,
      notes: expense.notes,
    });
    if (!error) {
      setExpenses((prev) => [...prev, { ...expense, id }]);
    }
  };

  const deleteExpense = async (id: string) => {
    const { error } = await supabase.from('expenses').delete().eq('id', id);
    if (!error) {
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    }
  };

  const addActivity = async (activity: Omit<Activity, 'id'>) => {
    const id = crypto.randomUUID();
    const { error } = await supabase.from('activities').insert({
      id,
      trip_id: tripIdRef.current ?? null,
      user_id: user?.id,
      name: activity.name,
      date: activity.date,
      time: activity.time,
      location: activity.location,
      category: activity.category,
      notes: activity.notes,
    });
    if (!error) {
      setActivities((prev) => [...prev, { ...activity, id }]);
    }
  };

  const deleteActivity = async (id: string) => {
    const { error } = await supabase.from('activities').delete().eq('id', id);
    if (!error) {
      setActivities((prev) => prev.filter((a) => a.id !== id));
    }
  };

  const toggleSaveExperience = (id: string) => {
    setExperiences(experiences.map((exp) => (exp.id === id ? { ...exp, saved: !exp.saved } : exp)));
  };

  return (
    <TravelContext.Provider
      value={{
        tripDetails,
        setTripDetails,
        expenses,
        addExpense,
        deleteExpense,
        activities,
        addActivity,
        deleteActivity,
        experiences,
        toggleSaveExperience,
        jetLagPlan,
        setJetLagPlan,
        activeCity,
        setActiveCity,
      }}
    >
      {children}
    </TravelContext.Provider>
  );
}

export function useTravel() {
  const context = useContext(TravelContext);
  if (context === undefined) {
    throw new Error('useTravel must be used within a TravelProvider');
  }
  return context;
}
