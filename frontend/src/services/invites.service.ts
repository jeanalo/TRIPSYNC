import { apiClient } from '@/lib/apiClient';

export interface TripInviteInfo {
  trip_id: string;
  destination_country: string;
  departure_date: string;
  arrival_date: string;
}

export async function createInviteLink(tripId: string): Promise<string> {
  const { token } = await apiClient.post<{ token: string }>(`/api/trips/${tripId}/invite`, {});
  return `${window.location.origin}/join-trip?token=${token}`;
}

export async function getInviteInfo(token: string): Promise<TripInviteInfo> {
  return apiClient.get<TripInviteInfo>(`/api/trips/join?token=${token}`);
}

export async function joinTrip(token: string): Promise<string> {
  const { tripId } = await apiClient.post<{ tripId: string }>('/api/trips/join', { token });
  return tripId;
}
