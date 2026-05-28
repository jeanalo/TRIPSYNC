import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAdminTripsService, getAdminUsersService } from '../services/admin.service';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthProvider';
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
  const { user, loading: authLoading } = useAuth();
  const [trips, setTrips] = useState<AdminTrip[]>([]);
  const [tripsStats, setTripsStats] = useState<AdminTripsStats>(emptyTripsStats);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [usersStats, setUsersStats] = useState<AdminUserStats>(emptyUserStats);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    activeUsers: 0,
    activeTrips: 0,
    topCountries: [],
  });
  const [experiences, setExperiences] = useState<AdminExperience[]>([]);
  const [experiencesStats, setExperiencesStats] = useState<AdminExperiencesStats>({
    totalExperiences: 0,
    activeExperiences: 0,
    pendingApproval: 0,
    mostPopularCategory: '—',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadAdminDashboardData() {
    try {
      setLoading(true);
      setError(null);

      const [tripsData, usersData, expResult] = await Promise.all([
        getAdminTripsService(),
        getAdminUsersService(),
        supabase
          .from('experiences')
          .select('id, name, country, location, category, duration, difficulty, image'),
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

      const expData = (expResult.data ?? []) as AdminExperience[];
      setExperiences(expData);

      const categoryCounts: Record<string, number> = {};
      expData.forEach((e) => {
        categoryCounts[e.category] = (categoryCounts[e.category] || 0) + 1;
      });
      const topCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0];
      setExperiencesStats({
        totalExperiences: expData.length,
        activeExperiences: expData.length,
        pendingApproval: 0,
        mostPopularCategory: topCategory ? topCategory[0] : '—',
      });
    } catch (err) {
      console.error('Error fetching admin dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Error loading admin data');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (authLoading) return;
    if (user?.role !== 'admin') {
      setLoading(false);
      return;
    }
    loadAdminDashboardData();
  }, [user, authLoading]);

  return (
    <AdminContext.Provider
      value={{
        trips,
        tripsStats,
        experiences,
        experiencesStats,
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
