import type {
  AdminStats,
  VisitedCity,
  SelectOption,
  AdminExperience,
  AdminExperiencesStats,
} from '@/types/admin.types';

export const mockAdminStats: AdminStats = {
  activeUsers: 54,
  activeTrips: 12,
  topDestination: 'Bali, Indonesia',
};

export const mockAdminExperiencesStats: AdminExperiencesStats = {
  totalExperiences: 128,
  activeExperiences: 92,
  pendingApproval: 36,
  mostPopularCategory: 'Adventure',
};

export const mockAdminExperiences: AdminExperience[] = [
  {
    id: 'exp-001',
    name: 'Eiffel Tower Tour',
    city: 'Paris',
    category: 'Cultural',
    price: 45,
    rating: 4.8,
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=200',
    dateCreated: '2024-03-15',
  },
  {
    id: 'exp-002',
    name: 'Amazon Rainforest Trek',
    city: 'Manaus',
    category: 'Adventure',
    price: 120,
    rating: 4.9,
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=80&w=200',
    dateCreated: '2024-03-10',
  },
  {
    id: 'exp-003',
    name: 'Sushi Making Workshop',
    city: 'Tokyo',
    category: 'Gastronomy',
    price: 65,
    rating: 4.7,
    status: 'pending',
    imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=200',
    dateCreated: '2024-03-18',
  },
  {
    id: 'exp-004',
    name: 'London Bridge Walking Tour',
    city: 'London',
    category: 'Cultural',
    price: 0,
    rating: 4.5,
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&q=80&w=200',
    dateCreated: '2024-03-05',
  },
  {
    id: 'exp-005',
    name: 'Bali Surf School',
    city: 'Bali',
    category: 'Adventure',
    price: 35,
    rating: 4.9,
    status: 'pending',
    imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=200',
    dateCreated: '2024-03-20',
  },
];

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
