import { apiClient } from '@/lib/apiClient';
import type { AdminTrip, AdminTripsStats, AdminUser, VisitedCountry } from '@/types/admin.types';

export interface AdminTripsResponse {
  trips: AdminTrip[];
  stats: AdminTripsStats;
  topCountries: VisitedCountry[];
}

export interface AdminUsersResponse {
  users: AdminUser[];
  stats: { totalUsers: number; activeUsers: number };
}

export const getAdminTripsService = (): Promise<AdminTripsResponse> =>
  apiClient.get<AdminTripsResponse>('/api/admin/trips');

export const getAdminUsersService = (): Promise<AdminUsersResponse> =>
  apiClient.get<AdminUsersResponse>('/api/admin/users');
