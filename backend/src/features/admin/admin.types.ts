export interface AdminTripRow {
  id: string;
  travelerName: string;
  originCountry: string;
  destinationCountry: string;
  startDate: string;
  endDate: string;
  budget: number;
  status: 'active' | 'upcoming' | 'completed';
}

export interface AdminTripsStats {
  totalTrips: number;
  activeTrips: number;
  completedTrips: number;
  topDestination: string;
}

export interface VisitedCountry {
  rank: number;
  country: string;
  visitors: number;
}

export interface AdminTripsResponse {
  trips: AdminTripRow[];
  stats: AdminTripsStats;
  topCountries: VisitedCountry[];
}

export interface AdminUserRow {
  id: string;
  name: string;
  email: string;
  avatar: string;
  country: string;
  joinDate: string;
  tripCount: number;
  status: 'active' | 'inactive';
}

export interface AdminUsersStats {
  totalUsers: number;
  activeUsers: number;
}

export interface AdminUsersResponse {
  users: AdminUserRow[];
  stats: AdminUsersStats;
}
