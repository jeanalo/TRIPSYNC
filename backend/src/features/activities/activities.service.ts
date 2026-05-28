import Boom from '@hapi/boom';
import { supabase } from '../../config/supabase';
import { Activity, CreateActivityRequest } from './activities.types';

export const getActivitiesByUserService = async (userId: string): Promise<Activity[]> => {
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: true });

  if (error) throw error;
  return (data ?? []).map((a) => ({
    id: a.id,
    user_id: a.user_id,
    trip_id: a.trip_id ?? null,
    name: a.name,
    date: a.date,
    time: a.time,
    location: a.location ?? '',
    category: a.category ?? '',
    notes: a.notes ?? '',
  }));
};

export const createActivityService = async (userId: string, data: CreateActivityRequest): Promise<Activity> => {
  const id = crypto.randomUUID();
  const { data: inserted, error } = await supabase
    .from('activities')
    .insert({
      id,
      user_id: userId,
      trip_id: data.trip_id ?? null,
      name: data.name,
      date: data.date,
      time: data.time,
      location: data.location ?? '',
      category: data.category ?? '',
      notes: data.notes ?? '',
    })
    .select()
    .single();

  if (error) throw error;
  return inserted;
};

export const updateActivityService = async (id: string, userId: string, data: CreateActivityRequest): Promise<Activity> => {
  const { data: updated, error } = await supabase
    .from('activities')
    .update({
      name: data.name,
      date: data.date,
      time: data.time,
      location: data.location ?? '',
      category: data.category ?? '',
      notes: data.notes ?? '',
    })
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  if (!updated) throw Boom.notFound('Activity not found');
  return updated;
};

export const deleteActivityService = async (id: string, userId: string): Promise<void> => {
  const { error, count } = await supabase
    .from('activities')
    .delete({ count: 'exact' })
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw error;
  if ((count ?? 0) === 0) throw Boom.notFound('Activity not found');
};
