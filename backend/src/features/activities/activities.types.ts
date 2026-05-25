export interface Activity {
  id: string;
  user_id: string;
  trip_id?: string | null;
  name: string;
  date: string;
  time: string;
  location?: string;
  category?: string;
  notes?: string;
}

export interface CreateActivityRequest {
  trip_id?: string | null;
  name: string;
  date: string;
  time: string;
  location?: string;
  category?: string;
  notes?: string;
}
