import { supabase } from '../../config/supabase';
import { Expense, CreateExpenseRequest } from './expenses.types';

export const getExpensesByUserService = async (userId: string): Promise<Expense[]> => {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (error) throw error;
  return (data ?? []).map((e) => ({
    id: e.id,
    user_id: e.user_id,
    trip_id: e.trip_id ?? null,
    amount: Number(e.amount) || 0,
    category: e.category,
    date: e.date,
    notes: e.notes ?? '',
  }));
};

export const createExpenseService = async (userId: string, data: CreateExpenseRequest): Promise<Expense> => {
  const id = crypto.randomUUID();
  const { data: inserted, error } = await supabase
    .from('expenses')
    .insert({
      id,
      user_id: userId,
      trip_id: data.trip_id ?? null,
      amount: data.amount,
      category: data.category,
      date: data.date,
      notes: data.notes ?? '',
    })
    .select()
    .single();

  if (error) throw error;
  return { ...inserted, amount: Number(inserted.amount) || 0 };
};

export const deleteExpenseService = async (id: string, userId: string): Promise<boolean> => {
  const { error, count } = await supabase
    .from('expenses')
    .delete({ count: 'exact' })
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw error;
  return (count ?? 0) > 0;
};
