import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAdminTripsService, getAdminUsersService } from '../services/admin.service';
import { mockAdminExperiences, mockAdminExperiencesStats } from '../services/admin.mock';
import type {
  AdminTrip,
  AdminTripsStats,
  AdminExperience,
  AdminExperiencesStats,
  AdminUser,
  AdminUserStats,
  VisitedCountry,
} from '../types/admin.types';

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
  loading: boolean;
  error: string | null;
}

const emptyTripsStats: AdminTripsStats = {
  totalTrips: 0,
  activeTrips: 0,
  completedTrips: 0,
  topDestination: '—',
};

const emptyUserStats: AdminUserStats = {
  totalUsers: 0,
  activeUsers: 0,
  newThisMonth: 0,
  topCountry: '—',
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [trips, setTrips] = useState<AdminTrip[]>([]);
  const [tripsStats, setTripsStats] = useState<AdminTripsStats>(emptyTripsStats);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [usersStats, setUsersStats] = useState<AdminUserStats>(emptyUserStats);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    activeUsers: 0,
    activeTrips: 0,
    topCountries: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const [tripsData, usersData] = await Promise.all([
          getAdminTripsService(),
          getAdminUsersService(),
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
        setError(err instanceof Error ? err.message : 'Error loading admin data');
      } finally {
        setLoading(false);
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
        loading,
        error,
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
