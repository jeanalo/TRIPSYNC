export interface Trip {
  id: string;
  user_id: string;
  departure_country: string;
  destination_country: string;
  departure_date: string;
  arrival_date: string;
  budget: number;
  jet_lag_plan?: string | null;
  created_at?: string;
}

export interface UpsertTripRequest {
  id?: string;
  departure_country: string;
  destination_country: string;
  departure_date: string;
  arrival_date: string;
  budget: number;
  jet_lag_plan?: string | null;
}
