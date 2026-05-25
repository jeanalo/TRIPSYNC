import { supabase } from '../../config/supabase';
import { TripInvite, TripInviteInfo } from './invites.types';

export const createInviteService = async (tripId: string, userId: string): Promise<string> => {
  // Verify requester owns this trip
  const { data: trip, error: tripError } = await supabase
    .from('trips')
    .select('id, user_id, destination_country, departure_date, arrival_date')
    .eq('id', tripId)
    .single();

  if (tripError || !trip) throw new Error('Trip not found');
  if (trip.user_id !== userId) throw new Error('Forbidden');

  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  const { error } = await supabase.from('trip_invites').insert({
    id: crypto.randomUUID(),
    trip_id: tripId,
    token,
    created_by: userId,
    expires_at: expiresAt,
    used: false,
  });

  if (error) throw error;
  return token;
};

export const getInviteInfoService = async (token: string): Promise<TripInviteInfo> => {
  const { data: invite, error } = await supabase
    .from('trip_invites')
    .select('trip_id, used, expires_at')
    .eq('token', token)
    .single();

  if (error || !invite) throw new Error('Invalid invite token');
  if (invite.used) throw new Error('Invite already used');
  if (new Date(invite.expires_at) < new Date()) throw new Error('Invite expired');

  const { data: trip, error: tripError } = await supabase
    .from('trips')
    .select('id, destination_country, departure_date, arrival_date')
    .eq('id', invite.trip_id)
    .single();

  if (tripError || !trip) throw new Error('Trip not found');

  return {
    trip_id: trip.id,
    destination_country: trip.destination_country,
    departure_date: trip.departure_date,
    arrival_date: trip.arrival_date,
  };
};

export const joinTripService = async (token: string, userId: string): Promise<string> => {
  const { data: invite, error } = await supabase
    .from('trip_invites')
    .select('id, trip_id, used, expires_at, created_by')
    .eq('token', token)
    .single();

  if (error || !invite) throw new Error('Invalid invite token');
  if (invite.used) throw new Error('Invite already used');
  if (new Date(invite.expires_at) < new Date()) throw new Error('Invite expired');

  const tripId: string = invite.trip_id;

  // Cannot join your own trip
  if (invite.created_by === userId) throw new Error('You are the owner of this trip');

  // Check if already a member
  const { data: existing } = await supabase
    .from('trip_members')
    .select('id')
    .eq('trip_id', tripId)
    .eq('user_id', userId)
    .maybeSingle();

  if (existing) throw new Error('Already a member of this trip');

  const { error: memberError } = await supabase.from('trip_members').insert({
    id: crypto.randomUUID(),
    trip_id: tripId,
    user_id: userId,
    role: 'member',
    joined_at: new Date().toISOString(),
  });

  if (memberError) throw memberError;

  // Mark token as used
  await supabase.from('trip_invites').update({ used: true }).eq('id', invite.id);

  return tripId;
};
