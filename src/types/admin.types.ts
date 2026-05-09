export interface AdminStats {
  activeUsers: number;
  activeTrips: number;
  topDestination: string;
}

export interface SearchTripsFilters {
  country: string;
  city: string;
  travelDate: string;
}

export interface VisitedCity {
  rank: number;
  name: string;
  country: string;
  visitors: number;
}

export interface CreateExperienceFormData {
  country: string;
  city: string;
  date: string;
  time: string;
  activityName: string;
  location: string;
  category: string;
  details: string;
  imageUrl?: string;
}

export interface UnsplashImage {
  id: string;
  url: string;
  thumb: string;
  alt_description: string;
}

export interface AdminNavItem {
  to: string;
  label: string;
  icon: string;
}

export interface SelectOption {
  value: string;
  label: string;
}
