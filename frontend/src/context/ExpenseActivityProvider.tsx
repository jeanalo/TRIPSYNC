import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { useTrip } from './TripProvider';
import { apiClient } from '../lib/apiClient';
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

  async function loadExpensesAndActivities() {
    try {
      const expenseRows = await apiClient.get<Expense[]>('/api/expenses');
      setExpenses(expenseRows);
    } catch (err) {
      console.error('Error loading expenses:', err);
    }

    try {
      const activityRows = await apiClient.get<Activity[]>('/api/activities');
      setActivities(activityRows);
    } catch (err) {
      console.error('Error loading activities:', err);
    }
  }

  // Load expenses and activities from backend on user change
  useEffect(() => {
    if (!user?.id) {
      setExpenses([]);
      setActivities([]);
      return;
    }
    loadExpensesAndActivities();
  }, [user?.id]);

  const addExpense = async (expense: Omit<Expense, 'id'>) => {
    const created = await apiClient.post<Expense>('/api/expenses', {
      trip_id: tripId ?? null,
      amount: expense.amount,
      category: expense.category,
      date: expense.date,
      notes: expense.notes,
    });
    setExpenses((prev) => [...prev, created]);
  };

  const deleteExpense = async (id: string) => {
    await apiClient.delete(`/api/expenses/${id}`);
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const addActivity = async (activity: Omit<Activity, 'id'>) => {
    const created = await apiClient.post<Activity>('/api/activities', {
      trip_id: tripId ?? null,
      name: activity.name,
      date: activity.date,
      time: activity.time,
      location: activity.location,
      category: activity.category,
      notes: activity.notes,
    });
    setActivities((prev) => [...prev, created]);
  };

  const deleteActivity = async (id: string) => {
    await apiClient.delete(`/api/activities/${id}`);
    setActivities((prev) => prev.filter((a) => a.id !== id));
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
