import type {
  AdminAnalyticsStats,
  MonthlyBooking,
  TopDestination,
  TravelCategoryMetric,
  RecentActivity,
} from '@/types/admin.types';

export const mockAnalyticsStats: AdminAnalyticsStats = {
  totalBookings: 4820,
  mostVisitedCity: 'Paris',
  activeTravelers: 1248,
  revenueThisMonth: 84500,
};

export const mockMonthlyBookings: MonthlyBooking[] = [
  { month: 'Jan', bookings: 240 },
  { month: 'Feb', bookings: 320 },
  { month: 'Mar', bookings: 280 },
  { month: 'Apr', bookings: 450 },
  { month: 'May', bookings: 520 },
  { month: 'Jun', bookings: 610 },
  { month: 'Jul', bookings: 680 },
  { month: 'Aug', bookings: 590 },
  { month: 'Sep', bookings: 430 },
  { month: 'Oct', bookings: 350 },
  { month: 'Nov', bookings: 210 },
  { month: 'Dec', bookings: 140 },
];

export const mockTopDestinations: TopDestination[] = [
  { city: 'Paris', bookings: 850 },
  { city: 'Tokyo', bookings: 720 },
  { city: 'London', bookings: 640 },
  { city: 'Rio de Janeiro', bookings: 510 },
  { city: 'New York', bookings: 480 },
];

export const mockTravelCategories: TravelCategoryMetric[] = [
  { name: 'Adventure', percentage: 35 },
  { name: 'Cultural', percentage: 25 },
  { name: 'Gastronomy', percentage: 20 },
  { name: 'Relax', percentage: 20 },
];

export const mockRecentActivity: RecentActivity[] = [
  {
    id: 'act-001',
    traveler: 'Emma Watson',
    destination: 'Paris, France',
    experience: 'Eiffel Tower Night Tour',
    budget: 450,
    date: '2024-03-24',
    status: 'upcoming',
  },
  {
    id: 'act-002',
    traveler: 'John Doe',
    destination: 'Tokyo, Japan',
    experience: 'Shibuya Crossing Photo Walk',
    budget: 280,
    date: '2024-03-22',
    status: 'completed',
  },
  {
    id: 'act-003',
    traveler: 'Sarah Connor',
    destination: 'London, UK',
    experience: 'The British Museum Guided Tour',
    budget: 150,
    date: '2024-03-20',
    status: 'active',
  },
  {
    id: 'act-004',
    traveler: 'Mike Tyson',
    destination: 'Rio de Janeiro, Brazil',
    experience: 'Hang Gliding Adventure',
    budget: 850,
    date: '2024-03-18',
    status: 'completed',
  },
];
