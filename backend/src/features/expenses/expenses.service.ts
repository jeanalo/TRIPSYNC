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

const broadcastTripChange = async (tripId: string): Promise<void> => {
  const channel = supabase.channel(`trip:${tripId}`);
  await channel.httpSend('trip-changed', { tripId });
  supabase.removeChannel(channel);
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
  if (data.trip_id) broadcastTripChange(data.trip_id);
  return { ...inserted, amount: Number(inserted.amount) || 0 };
};

const assertTripAccess = async (tripId: string, userId: string): Promise<void> => {
  const { data: trip } = await supabase
    .from('trips')
    .select('user_id')
    .eq('id', tripId)
    .maybeSingle();

  if (trip?.user_id === userId) return;

  const { data: member } = await supabase
    .from('trip_members')
    .select('id')
    .eq('trip_id', tripId)
    .eq('user_id', userId)
    .maybeSingle();

  if (!member) throw Boom.forbidden('Access denied');
};

export const deleteExpenseService = async (id: string, userId: string): Promise<void> => {
  const { data: expense, error: fetchError } = await supabase
    .from('expenses')
    .select('id, trip_id, user_id')
    .eq('id', id)
    .maybeSingle();

  if (fetchError) throw fetchError;
  if (!expense) throw Boom.notFound('Expense not found');

  if (expense.user_id !== userId) {
    if (!expense.trip_id) throw Boom.forbidden('Access denied');
    await assertTripAccess(expense.trip_id, userId);
  }

  const { error, count } = await supabase
    .from('expenses')
    .delete({ count: 'exact' })
    .eq('id', id);

  if (error) throw error;
  if ((count ?? 0) === 0) throw Boom.notFound('Expense not found');
  if (expense.trip_id) broadcastTripChange(expense.trip_id);
};
