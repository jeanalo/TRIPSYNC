export interface AdminStats {
  activeUsers: number;
  activeTrips: number;
  topDestination: string;
}

export interface SearchTripsFilters {
  country: string;
}

export interface VisitedCountry {
  rank: number;
  country: string;
  visitors: number;
}

export interface CreateExperienceFormData {
  country: string;
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
  country: string;
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
  date: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  country: string;
  joinDate: string;
  tripCount: number;
  status: 'active' | 'inactive' | 'premium';
}

export interface AdminUserStats {
  totalUsers: number;
  activeUsers: number;
  newThisMonth: number;
  topCountry: string;
}

export interface AdminUserFilters {
  search: string;
  country: string;
  status: string;
}

export interface AdminAnalyticsStats {
  totalBookings: number;
  mostVisitedCountry: string;
  activeTravelers: number;
  revenueThisMonth: number;
}

export interface MonthlyBooking {
  month: string;
  bookings: number;
}

export interface TopDestination {
  country: string;
  bookings: number;
}

export interface TravelCategoryMetric {
  name: string;
  percentage: number;
}

export interface RecentActivity {
  id: string;
  traveler: string;
  destination: string;
  experience: string;
  budget: number;
  date: string;
  status: 'completed' | 'upcoming' | 'active';
}

export interface AdminPreference {
  language: string;
  timezone: string;
  emailNotifications: boolean;
  dashboardView: 'standard' | 'compact' | 'detailed';
}

export interface AdminSecurity {
  passwordStatus: string;
  twoFactorEnabled: boolean;
  lastLogin: string;
}

export interface AdminFullProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  status: 'active' | 'inactive';
  phone: string;
  location: string;
  joinedDate: string;
  preferences: AdminPreference;
  security: AdminSecurity;
}

export interface AdminAccountActivity {
  id: string;
  action: string;
  section: string;
  date: string;
  status: 'success' | 'warning' | 'info';
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
