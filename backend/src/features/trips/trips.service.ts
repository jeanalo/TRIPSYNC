import { supabase } from '../../config/supabase';
import { Trip, UpsertTripRequest } from './trips.types';

export const getTripByUserService = async (userId: string): Promise<Trip | null> => {
  
  const { data: ownedTrip, error: ownedError } = await supabase
    .from('trips')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (ownedError) throw ownedError;

  
  const { data: memberships, error: memberError } = await supabase
    .from('trip_members')
    .select('joined_at, trip_id')
    .eq('user_id', userId);

  if (memberError) throw memberError;

  
  if (!ownedTrip && (!memberships || memberships.length === 0)) {
    return null;
  }

  
  let joinedTrips: Trip[] = [];
  if (memberships && memberships.length > 0) {
    const tripIds = memberships.map((m) => m.trip_id);
    const { data: tripsData, error: tripsError } = await supabase
      .from('trips')
      .select('*')
      .in('id', tripIds);

    if (tripsError) throw tripsError;
    if (tripsData) {
      joinedTrips = tripsData;
    }
  }

 
  interface Candidate {
    trip: Trip;
    date: Date;
  }
  const candidates: Candidate[] = [];

  if (ownedTrip) {
    candidates.push({
      trip: ownedTrip,
      date: ownedTrip.created_at ? new Date(ownedTrip.created_at) : new Date(0),
    });
  }

  for (const m of memberships || []) {
    const tripObj = joinedTrips.find((t) => t.id === m.trip_id);
    if (tripObj) {
      candidates.push({
        trip: tripObj,
        date: m.joined_at ? new Date(m.joined_at) : new Date(0),
      });
    }
  }

  if (candidates.length === 0) return null;

  
  candidates.sort((a, b) => b.date.getTime() - a.date.getTime());

  const selectedTrip = candidates[0].trip;

  return { ...selectedTrip, budget: Number(selectedTrip.budget) || 0 };
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
