import { supabase } from '../../config/supabase';
import { AdminTripsResponse, AdminUsersResponse } from './admin.types';

export const getAdminTripsService = async (): Promise<AdminTripsResponse> => {
  const [{ data: allTrips, error: tripsError }, { data: profilesData }] = await Promise.all([
    supabase
      .from('trips')
      .select('id, user_id, departure_country, destination_country, departure_date, arrival_date, budget'),
    supabase.from('profiles').select('id, full_name'),
  ]);

  if (tripsError) throw tripsError;

  const profileMap: Record<string, string> = {};
  for (const p of profilesData ?? []) {
    profileMap[p.id] = p.full_name ?? `User ${String(p.id).slice(0, 8)}`;
  }

  const today = new Date().toISOString().split('T')[0];

  const trips = (allTrips ?? []).map((t) => {
    let status: 'active' | 'upcoming' | 'completed' = 'active';
    if (t.departure_date > today) status = 'upcoming';
    else if (t.arrival_date < today) status = 'completed';

    return {
      id: t.id,
      travelerName: profileMap[t.user_id] ?? `User ${String(t.user_id).slice(0, 8)}`,
      originCountry: t.departure_country ?? '',
      destinationCountry: t.destination_country ?? '',
      startDate: t.departure_date ?? '',
      endDate: t.arrival_date ?? '',
      budget: Number(t.budget) || 0,
      status,
    };
  });

  const countryCount: Record<string, number> = {};
  for (const trip of trips) {
    if (trip.destinationCountry) {
      countryCount[trip.destinationCountry] = (countryCount[trip.destinationCountry] || 0) + 1;
    }
  }

  const topCountries = Object.entries(countryCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([country, visitors], index) => ({ rank: index + 1, country, visitors }));

  return {
    trips,
    stats: {
      totalTrips: trips.length,
      activeTrips: trips.filter((t) => t.status === 'active').length,
      completedTrips: trips.filter((t) => t.status === 'completed').length,
      topDestination: topCountries[0]?.country ?? '',
    },
    topCountries,
  };
};

export const getAdminUsersService = async (): Promise<AdminUsersResponse> => {
  const [{ data: profilesData, error }, { data: allTrips }] = await Promise.all([
    supabase.from('profiles').select('id, full_name, email, avatar_url, country, created_at, role'),
    supabase.from('trips').select('user_id'),
  ]);

  if (error) throw error;

  const tripCountByUser: Record<string, number> = {};
  for (const trip of allTrips ?? []) {
    tripCountByUser[trip.user_id] = (tripCountByUser[trip.user_id] || 0) + 1;
  }

  const users = (profilesData ?? []).map((p) => ({
    id: p.id,
    name: p.full_name ?? `User ${String(p.id).slice(0, 8)}`,
    email: p.email ?? '',
    avatar: p.avatar_url ?? `https://i.pravatar.cc/150?u=${p.id}`,
    country: p.country ?? '',
    joinDate: p.created_at ? String(p.created_at).slice(0, 10) : '',
    tripCount: tripCountByUser[p.id] ?? 0,
    status: (p.role === 'admin' ? 'active' : 'active') as 'active' | 'inactive',
  }));

  const nonAdminUsers = users.filter((_, i) => (profilesData ?? [])[i]?.role !== 'admin');

  return {
    users,
    stats: {
      totalUsers: users.length,
      activeUsers: nonAdminUsers.length,
    },
  };
};
