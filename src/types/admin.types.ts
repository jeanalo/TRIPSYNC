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

export interface AdminExperience {
  id: string;
  name: string;
  city: string;
  category: string;
  price: number;
  rating: number;
  status: 'active' | 'pending';
  imageUrl: string;
  dateCreated: string;
}

export interface AdminExperiencesStats {
  totalExperiences: number;
  activeExperiences: number;
  pendingApproval: number;
  mostPopularCategory: string;
}

export interface AdminExperienceFilters {
  search: string;
  category: string;
  city: string;
  status: string;
}

export interface AdminTrip {
  id: string;
  travelerName: string;
  originCountry: string;
  destinationCountry: string;
  startDate: string;
  endDate: string;
  budget: number;
  status: 'active' | 'upcoming' | 'completed' | 'cancelled';
}

export interface AdminTripsStats {
  totalTrips: number;
  activeTrips: number;
  completedTrips: number;
  topDestination: string;
}

export interface AdminTripFilters {
  search: string;
  country: string;
  status: string;
  date: string;
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
