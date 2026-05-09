/** Statistics displayed on the admin dashboard cards */
export interface AdminStats {
  activeUsers: number;
  activeTrips: number;
  topDestination: string;
}

/** Filters for the Search Trips widget */
export interface SearchTripsFilters {
  country: string;
  city: string;
  travelDate: string;
}

/** A single city entry in the Most Visited Cities ranking */
export interface VisitedCity {
  rank: number;
  name: string;
  country: string;
  visitors: number;
}

/** Form data for creating a new experience */
export interface CreateExperienceFormData {
  country: string;
  city: string;
  date: string;
  time: string;
  activityName: string;
  location: string;
  category: string;
  details: string;
}

/** Navigation item for the admin sidebar */
export interface AdminNavItem {
  to: string;
  label: string;
  icon: string;
}

/** Select option used across admin dropdowns */
export interface SelectOption {
  value: string;
  label: string;
}
