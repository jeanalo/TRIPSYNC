import React, { createContext, useContext, useState, useEffect } from 'react';

export type Expense = {
  id: string;
  amount: number;
  category: string;
  date: string;
  notes: string;
};

export type Activity = {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  category: string;
  notes: string;
};

export type Experience = {
  id: string;
  title: string;
  location: string;
  category: 'Chill' | 'Adventure' | 'Cultural' | 'Free Tour';
  image: string;
  saved: boolean;
};

export type TripDetails = {
  departureCountry: string;
  destinationCountry: string;
  departureDate: string;
  arrivalDate: string;
  budget: number;
};

interface TravelContextType {
  tripDetails: TripDetails;
  setTripDetails: (details: TripDetails) => void;
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  activities: Activity[];
  addActivity: (activity: Omit<Activity, 'id'>) => void;
  experiences: Experience[];
  toggleSaveExperience: (id: string) => void;
  user: { name: string; email: string } | null;
  register: (email: string, name: string) => void;
  login: (email: string) => void;
  logout: () => void;
}

const TravelContext = createContext<TravelContextType | undefined>(undefined);

export function TravelProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ name: string; email: string } | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const [tripDetails, setTripDetails] = useState<TripDetails>(() => {
    const saved = localStorage.getItem('tripDetails');
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...parsed, budget: Number(parsed.budget) || 0 };
    }
    return {
      departureCountry: '',
      destinationCountry: '',
      departureDate: '',
      arrivalDate: '',
      budget: 0,
    };
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('expenses');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((expense: Expense) => ({
        ...expense,
        amount: Number(expense.amount) || 0,
      }));
    }
    return [];
  });

  const [activities, setActivities] = useState<Activity[]>(() => {
    const saved = localStorage.getItem('activities');
    return saved ? JSON.parse(saved) : [];
  });

  const [experiences, setExperiences] = useState<Experience[]>(() => {
    const saved = localStorage.getItem('experiences');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: '1',
            title: 'Sunset Kayaking',
            location: 'Blue Bay',
            category: 'Adventure',
            image:
              'https://images.unsplash.com/photo-1595368062405-e4d7840cba14?w=600&q=80',
            saved: false,
          },
          {
            id: '2',
            title: 'Ancient Temple Visit',
            location: 'Old Town',
            category: 'Cultural',
            image:
              'https://images.unsplash.com/photo-1598177183224-b3cec6da6b04?w=600&q=80',
            saved: true,
          },
          {
            id: '3',
            title: 'Street Food Tour',
            location: 'Night Market',
            category: 'Chill',
            image:
              'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80',
            saved: false,
          },
          {
            id: '4',
            title: 'Hidden Waterfall Hike',
            location: 'National Park',
            category: 'Free Tour',
            image:
              'https://images.unsplash.com/photo-1594671733084-66a82cc4304a?w=600&q=80',
            saved: false,
          },
        ];
  });

  useEffect(() => {
    localStorage.setItem('tripDetails', JSON.stringify(tripDetails));
  }, [tripDetails]);

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('experiences', JSON.stringify(experiences));
  }, [experiences]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    setExpenses([
      ...expenses,
      { ...expense, id: Math.random().toString(36).substr(2, 9) },
    ]);
  };

  const addActivity = (activity: Omit<Activity, 'id'>) => {
    setActivities([
      ...activities,
      { ...activity, id: Math.random().toString(36).substr(2, 9) },
    ]);
  };

  const toggleSaveExperience = (id: string) => {
    setExperiences(
      experiences.map((exp) => (exp.id === id ? { ...exp, saved: !exp.saved } : exp))
    );
  };

  const register = (email: string, name: string) => {
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
    registeredUsers[email] = { name, email };
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
  };

  const login = (email: string) => {
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
    const registered = registeredUsers[email];
    setUser({ name: registered?.name || email, email });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <TravelContext.Provider
      value={{
        tripDetails,
        setTripDetails,
        expenses,
        addExpense,
        activities,
        addActivity,
        experiences,
        toggleSaveExperience,
        user,
        register,
        login,
        logout,
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
