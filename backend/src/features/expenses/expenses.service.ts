import Boom from '@hapi/boom';
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

export const getExpensesByTripService = async (tripId: string, userId: string): Promise<Expense[]> => {
 
  const { data: trip, error: tripError } = await supabase
    .from('trips')
    .select('id, user_id')
    .eq('id', tripId)
    .maybeSingle();

  if (tripError) throw tripError;
  if (!trip) throw Boom.notFound('Trip not found');

  const isOwner = trip.user_id === userId;

  let isMember = false;
  if (!isOwner) {
    const { data: member, error: memberError } = await supabase
      .from('trip_members')
      .select('id')
      .eq('trip_id', tripId)
      .eq('user_id', userId)
      .maybeSingle();

    if (memberError) throw memberError;
    if (member) isMember = true;
  }

  if (!isOwner && !isMember) {
    throw Boom.forbidden('Access denied to this trip');
  }

  
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('trip_id', tripId)
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

export const deleteExpenseService = async (id: string, userId: string): Promise<void> => {
  const { error, count } = await supabase
    .from('expenses')
    .delete({ count: 'exact' })
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw error;
  if ((count ?? 0) === 0) throw Boom.notFound('Expense not found');
};
