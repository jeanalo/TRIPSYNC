import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { useTrip } from './TripProvider';
import { supabase } from '../lib/supabase';
import type { Expense, Activity } from '../types/travel.types';

interface ExpenseActivityContextType {
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  activities: Activity[];
  addActivity: (activity: Omit<Activity, 'id'>) => Promise<void>;
  deleteActivity: (id: string) => Promise<void>;
}

const ExpenseActivityContext = createContext<ExpenseActivityContextType | undefined>(undefined);

const ExpenseActivityProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const { tripId } = useTrip();

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  // Load expenses and activities from Supabase on user change
  useEffect(() => {
    if (!user?.id) {
      setExpenses([]);
      setActivities([]);
      return;
    }

    (async () => {
      const { data: expenseRows } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id);
      setExpenses(
        (expenseRows ?? []).map((e) => ({
          id: e.id,
          amount: Number(e.amount) || 0,
          category: e.category,
          date: e.date,
          notes: e.notes ?? '',
        }))
      );

      const { data: activityRows } = await supabase
        .from('activities')
        .select('*')
        .eq('user_id', user.id);
      setActivities(
        (activityRows ?? []).map((a) => ({
          id: a.id,
          name: a.name,
          date: a.date,
          time: a.time,
          location: a.location ?? '',
          category: a.category,
          notes: a.notes ?? '',
        }))
      );
    })();
  }, [user?.id]);

  const addExpense = async (expense: Omit<Expense, 'id'>) => {
    const id = crypto.randomUUID();
    const { error } = await supabase.from('expenses').insert({
      id,
      trip_id: tripId ?? null,
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
      trip_id: tripId ?? null,
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

  return (
    <ExpenseActivityContext.Provider
      value={{ expenses, addExpense, deleteExpense, activities, addActivity, deleteActivity }}
    >
      {children}
    </ExpenseActivityContext.Provider>
  );
};

export default ExpenseActivityProvider;

export const useExpenseActivity = () => {
  const context = useContext(ExpenseActivityContext);
  if (context === undefined) {
    throw new Error('useExpenseActivity must be used within an ExpenseActivityProvider');
  }
  return context;
};
