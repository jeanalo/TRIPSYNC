import Boom from '@hapi/boom';
import { supabase } from '../../config/supabase';
import { Trip, UpsertTripRequest } from './trips.types';

const broadcastTripChange = async (tripId: string): Promise<void> => {
  const channel = supabase.channel(`trip:${tripId}`);
  await channel.httpSend('trip-changed', { tripId });
  supabase.removeChannel(channel);
};

export const getTripByUserService = async (userId: string): Promise<Trip | null> => {
  
  const { data: ownedTrips, error: ownedError } = await supabase
    .from('trips')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1);

  if (ownedError) throw ownedError;
  const ownedTrip = ownedTrips?.[0] ?? null;

  
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
    const { data: trip, error: tripError } = await supabase
      .from('trips')
      .select('id, user_id')
      .eq('id', data.id)
      .maybeSingle();

    if (tripError) throw tripError;
    if (!trip) throw Boom.notFound('Trip not found');

    const isOwner = trip.user_id === userId;
    if (!isOwner) {
      const { data: member, error: memberError } = await supabase
        .from('trip_members')
        .select('id')
        .eq('trip_id', data.id)
        .eq('user_id', userId)
        .maybeSingle();

      if (memberError) throw memberError;
      if (!member) throw Boom.forbidden('Access denied to this trip');
    }

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
      .select()
      .single();

    if (error) throw error;
    broadcastTripChange(data.id);
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
