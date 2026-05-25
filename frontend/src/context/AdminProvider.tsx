import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../lib/apiClient';
import {
  mockAdminExperiences,
  mockAdminExperiencesStats,
  mockAdminUserStats,
  mockAdminTripsStats,
} from '../services/admin.mock';
import type {
  AdminTrip,
  AdminTripsStats,
  AdminExperience,
  AdminExperiencesStats,
  AdminUser,
  AdminUserStats,
  VisitedCountry,
} from '../types/admin.types';

interface BackendTripsResponse {
  trips: AdminTrip[];
  stats: AdminTripsStats;
  topCountries: VisitedCountry[];
}

interface BackendUsersResponse {
  users: AdminUser[];
  stats: { totalUsers: number; activeUsers: number };
}

interface DashboardStats {
  activeUsers: number;
  activeTrips: number;
  topCountries: VisitedCountry[];
}

interface AdminContextType {
  trips: AdminTrip[];
  tripsStats: AdminTripsStats;
  experiences: AdminExperience[];
  experiencesStats: AdminExperiencesStats;
  users: AdminUser[];
  usersStats: AdminUserStats;
  dashboardStats: DashboardStats;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [trips, setTrips] = useState<AdminTrip[]>([]);
  const [tripsStats, setTripsStats] = useState<AdminTripsStats>(mockAdminTripsStats);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [usersStats, setUsersStats] = useState<AdminUserStats>(mockAdminUserStats);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    activeUsers: 0,
    activeTrips: 0,
    topCountries: [],
  });

  useEffect(() => {
    (async () => {
      try {
        const [tripsData, usersData] = await Promise.all([
          apiClient.get<BackendTripsResponse>('/api/admin/trips'),
          apiClient.get<BackendUsersResponse>('/api/admin/users'),
        ]);

        setTrips(tripsData.trips);
        setTripsStats(tripsData.stats);
        setDashboardStats({
          activeTrips: tripsData.stats.totalTrips,
          activeUsers: usersData.stats.activeUsers,
          topCountries: tripsData.topCountries,
        });

        setUsers(usersData.users);
        setUsersStats((prev) => ({
          ...prev,
          totalUsers: usersData.stats.totalUsers,
          activeUsers: usersData.stats.activeUsers,
        }));
      } catch (err) {
        console.error('Error fetching admin dashboard data:', err);
      }
    })();
  }, []);

  return (
    <AdminContext.Provider
      value={{
        trips,
        tripsStats,
        experiences: mockAdminExperiences,
        experiencesStats: mockAdminExperiencesStats,
        users,
        usersStats,
        dashboardStats,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
