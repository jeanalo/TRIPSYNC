export interface TripInvite {
  id: string;
  trip_id: string;
  token: string;
  created_by: string;
  expires_at: string;
  used: boolean;
}

export interface TripInviteInfo {
  trip_id: string;
  destination_country: string;
  departure_date: string;
  arrival_date: string;
  trip_name?: string;
}
