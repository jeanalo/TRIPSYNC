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

export type Recommendation = {
  title: string;
  desc: string;
};

export type JetLagPlan = {
  departureTime: string;
  arrivalTime: string;
  recommendations: Recommendation[] | null;
};

interface TravelContextType {
  tripDetails: TripDetails;
  setTripDetails: (details: TripDetails) => void;
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  deleteExpense: (id: string) => void;
  activities: Activity[];
  addActivity: (activity: Omit<Activity, 'id'>) => void;
  experiences: Experience[];
  toggleSaveExperience: (id: string) => void;
  jetLagPlan: JetLagPlan | null;
  setJetLagPlan: (plan: JetLagPlan | null) => void;
  user: { name: string; email: string } | null;
  register: (email: string, name: string) => void;
  login: (email: string) => void;
  logout: () => void;
}

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

const TravelContext = createContext<TravelContextType | undefined>(undefined);

export function TravelProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ name: string; email: string } | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const [tripDetails, setTripDetailsState] = useState<TripDetails>(() => {
    const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
    const saved = localStorage.getItem(getKey('tripDetails', currentUser?.email));
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...parsed, budget: Number(parsed.budget) || 0 };
    }
    return defaultTripDetails;
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
    const saved = localStorage.getItem(getKey('expenses', currentUser?.email));
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
    const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
    const saved = localStorage.getItem(getKey('activities', currentUser?.email));
    return saved ? JSON.parse(saved) : [];
  });

  const [experiences, setExperiences] = useState<Experience[]>(() => {
    const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
    const saved = localStorage.getItem(getKey('experiences', currentUser?.email));
    return saved ? JSON.parse(saved) : defaultExperiences;
  });

  const [jetLagPlan, setJetLagPlanState] = useState<JetLagPlan | null>(() => {
    const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
    const saved = localStorage.getItem(getKey('jetLagPlan', currentUser?.email));
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    const savedTrip = localStorage.getItem(getKey('tripDetails', user?.email));
    if (savedTrip) {
      const parsed = JSON.parse(savedTrip);
      setTripDetailsState({ ...parsed, budget: Number(parsed.budget) || 0 });
    } else {
      setTripDetailsState(defaultTripDetails);
    }

    const savedExpenses = localStorage.getItem(getKey('expenses', user?.email));
    if (savedExpenses) {
      const parsed = JSON.parse(savedExpenses);
      setExpenses(
        parsed.map((expense: Expense) => ({
          ...expense,
          amount: Number(expense.amount) || 0,
        }))
      );
    } else {
      setExpenses([]);
    }

    const savedActivities = localStorage.getItem(getKey('activities', user?.email));
    setActivities(savedActivities ? JSON.parse(savedActivities) : []);

    const savedExperiences = localStorage.getItem(getKey('experiences', user?.email));
    setExperiences(savedExperiences ? JSON.parse(savedExperiences) : defaultExperiences);

    const savedJetLagPlan = localStorage.getItem(getKey('jetLagPlan', user?.email));
    setJetLagPlanState(savedJetLagPlan ? JSON.parse(savedJetLagPlan) : null);
  }, [user?.email]);

  useEffect(() => {
    if (user?.email) {
      localStorage.setItem(
        getKey('tripDetails', user.email),
        JSON.stringify(tripDetails)
      );
    }
  }, [tripDetails, user?.email]);

  useEffect(() => {
    if (user?.email) {
      localStorage.setItem(getKey('expenses', user.email), JSON.stringify(expenses));
    }
  }, [expenses, user?.email]);

  useEffect(() => {
    if (user?.email) {
      localStorage.setItem(getKey('activities', user.email), JSON.stringify(activities));
    }
  }, [activities, user?.email]);

  useEffect(() => {
    if (user?.email) {
      localStorage.setItem(
        getKey('experiences', user.email),
        JSON.stringify(experiences)
      );
    }
  }, [experiences, user?.email]);

  useEffect(() => {
    if (user?.email) {
      if (jetLagPlan) {
        localStorage.setItem(
          getKey('jetLagPlan', user.email),
          JSON.stringify(jetLagPlan)
        );
      } else {
        localStorage.removeItem(getKey('jetLagPlan', user.email));
      }
    }
  }, [jetLagPlan, user?.email]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const setTripDetails = (details: TripDetails) => {
    setTripDetailsState(details);
  };

  const setJetLagPlan = (plan: JetLagPlan | null) => {
    setJetLagPlanState(plan);
  };

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    setExpenses([
      ...expenses,
      { ...expense, id: Math.random().toString(36).substr(2, 9) },
    ]);
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter((e) => e.id !== id));
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
        deleteExpense,
        activities,
        addActivity,
        experiences,
        toggleSaveExperience,
        jetLagPlan,
        setJetLagPlan,
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
