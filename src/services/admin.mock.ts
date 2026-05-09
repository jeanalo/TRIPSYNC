import type {
  AdminStats,
  VisitedCity,
  SelectOption,
} from '@/types/admin.types';


export const mockAdminStats: AdminStats = {
  activeUsers: 54,
  activeTrips: 12,
  topDestination: 'Bali, Indonesia',
};


export const mockVisitedCities: VisitedCity[] = [
  { rank: 1, name: 'Paris', country: 'France', visitors: 5 },
  { rank: 2, name: 'London', country: 'UK', visitors: 2 },
  { rank: 3, name: 'Madrid', country: 'Spain', visitors: 1 },
  { rank: 4, name: 'Cali', country: 'Colombia', visitors: 1 },
  { rank: 5, name: 'Rio', country: 'Brazil', visitors: 1 },
];


export const mockCountryOptions: SelectOption[] = [
  { value: 'france', label: 'France' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'spain', label: 'Spain' },
  { value: 'colombia', label: 'Colombia' },
  { value: 'brazil', label: 'Brazil' },
  { value: 'indonesia', label: 'Indonesia' },
  { value: 'japan', label: 'Japan' },
  { value: 'usa', label: 'United States' },
];


export const mockCityOptions: SelectOption[] = [
  { value: 'paris', label: 'Paris' },
  { value: 'london', label: 'London' },
  { value: 'madrid', label: 'Madrid' },
  { value: 'cali', label: 'Cali' },
  { value: 'rio', label: 'Rio de Janeiro' },
  { value: 'bali', label: 'Bali' },
  { value: 'tokyo', label: 'Tokyo' },
  { value: 'new-york', label: 'New York' },
];


export const mockCategoryOptions: SelectOption[] = [
  { value: 'adventure', label: 'Adventure' },
  { value: 'cultural', label: 'Cultural' },
  { value: 'chill', label: 'Chill' },
  { value: 'free-tour', label: 'Free Tour' },
  { value: 'gastronomy', label: 'Gastronomy' },
  { value: 'nature', label: 'Nature' },
];


export const mockAdminUser = {
  name: 'Juanita',
  email: 'juanita@tripsync.com',
};
