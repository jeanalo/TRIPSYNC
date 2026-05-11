import React, { createContext, useContext, useState, useEffect } from 'react';
import type { VisitedCountry } from '../types/admin.types';
import {
  mockAdminTripsStats,
  mockAdminExperiences,
  mockAdminExperiencesStats,
  mockAdminUserStats
} from '../services/admin.mock';
import { supabase } from '../lib/supabase';
import type {
  AdminTrip,
  AdminTripsStats,
  AdminExperience,
  AdminExperiencesStats,
  AdminUser,
  AdminUserStats
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
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [trips, setTrips] = useState<AdminTrip[]>([]);
  const [tripsStats, setTripsStats] = useState<AdminTripsStats>(mockAdminTripsStats);
  const [experiences] = useState<AdminExperience[]>(mockAdminExperiences);
  const [experiencesStats] = useState<AdminExperiencesStats>(mockAdminExperiencesStats);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [usersStats, setUsersStats] = useState<AdminUserStats>(mockAdminUserStats);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    activeUsers: 0,
    activeTrips: 0,
    topCountries: [],
  });

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const { data: allTrips, error: tripsError } = await supabase
          .from('trips')
          .select('id, user_id, departure_country, destination_country, departure_date, arrival_date, budget');

        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('*');

        if (!tripsError && allTrips && allTrips.length > 0) {
          const profileMap: Record<string, string> = {};
          if (!profilesError && profilesData) {
            for (const p of profilesData) {
              profileMap[p.id] = p.full_name ?? `User ${p.id.slice(0, 8)}`;
            }
          }

          const today = new Date().toISOString().split('T')[0];

          const mappedTrips: AdminTrip[] = allTrips.map((t) => {
            let status: AdminTrip['status'] = 'active';
            if (t.departure_date > today) status = 'upcoming';
            else if (t.arrival_date < today) status = 'completed';

            return {
              id: t.id,
              travelerName: profileMap[t.user_id] ?? `User ${String(t.user_id).slice(0, 8)}`,
              originCountry: t.departure_country ?? '',
              destinationCountry: t.destination_country ?? '',
              startDate: t.departure_date ?? '',
              endDate: t.arrival_date ?? '',
              budget: t.budget ?? 0,
              status,
            };
          });

          setTrips(mappedTrips);

          const countryCount: Record<string, number> = {};
          for (const trip of allTrips) {
            const country = trip.destination_country;
            if (country) countryCount[country] = (countryCount[country] || 0) + 1;
          }

          let topCountry = '';
          let maxCount = 0;
          for (const [country, count] of Object.entries(countryCount)) {
            if (count > maxCount) { maxCount = count; topCountry = country; }
          }

          if (topCountry) {
            setTripsStats((prev) => ({
              ...prev,
              totalTrips: allTrips.length,
              topDestination: topCountry,
            }));
          }

          const sortedCountries = Object.entries(countryCount)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([country, count], index) => ({ rank: index + 1, country, visitors: count }));

          setDashboardStats((prev) => ({
            ...prev,
            activeTrips: allTrips.length,
            topCountries: sortedCountries,
          }));
        }

        if (!profilesError && profilesData) {
          const travelerCount = profilesData.filter((p) => p.role !== 'admin').length;

          setDashboardStats((prev) => ({ ...prev, activeUsers: travelerCount }));
          setUsersStats((prev) => ({
            ...prev,
            totalUsers: profilesData.length,
            activeUsers: travelerCount,
          }));

          const tripCountByUser: Record<string, number> = {};
          if (!tripsError && allTrips) {
            for (const trip of allTrips) {
              tripCountByUser[trip.user_id] = (tripCountByUser[trip.user_id] || 0) + 1;
            }
          }

          const mappedUsers: AdminUser[] = profilesData.map((p) => ({
            id: p.id,
            name: p.full_name ?? `User ${String(p.id).slice(0, 8)}`,
            email: p.email ?? '',
            avatar: p.avatar_url ?? `https://i.pravatar.cc/150?u=${p.id}`,
            country: p.country ?? '',
            joinDate: p.created_at ? p.created_at.slice(0, 10) : '',
            tripCount: tripCountByUser[p.id] ?? 0,
            status: (p.role === 'admin' ? 'active' : 'active') as AdminUser['status'],
          }));

          setUsers(mappedUsers);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      }
    }

    fetchDashboardData();
  }, []);

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
