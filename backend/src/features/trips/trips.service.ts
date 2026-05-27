import { supabase } from '../../config/supabase';
import { Trip, UpsertTripRequest } from './trips.types';

export const getTripByUserService = async (userId: string): Promise<Trip | null> => {
  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return { ...data, budget: Number(data.budget) || 0 };
};

export const upsertTripService = async (userId: string, data: UpsertTripRequest): Promise<Trip> => {
  if (data.id) {
    const { data: updated, error } = await supabase
      .from('trips')
      .update({
        departure_country: data.departure_country,
        destination_country: data.destination_country,
        departure_date: data.departure_date,
        arrival_date: data.arrival_date,
        budget: String(data.budget),
        ...(data.jet_lag_plan !== undefined ? { jet_lag_plan: data.jet_lag_plan } : {}),
      })
      .eq('id', data.id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return { ...updated, budget: Number(updated.budget) || 0 };
  }

  const id = crypto.randomUUID();
  const { data: inserted, error } = await supabase
    .from('trips')
    .insert({
      id,
      user_id: userId,
      departure_country: data.departure_country,
      destination_country: data.destination_country,
      departure_date: data.departure_date,
      arrival_date: data.arrival_date,
      budget: String(data.budget),
      created_at: new Date().toISOString(),
      ...(data.jet_lag_plan !== undefined ? { jet_lag_plan: data.jet_lag_plan } : {}),
    })
    .select()
    .single();

  if (error) throw error;
  return { ...inserted, budget: Number(inserted.budget) || 0 };
};
