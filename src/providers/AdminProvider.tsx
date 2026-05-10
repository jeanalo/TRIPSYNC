import React, { createContext, useContext, useState } from 'react';
import { 
  mockAdminTrips, 
  mockAdminTripsStats, 
  mockAdminExperiences,
  mockAdminExperiencesStats,
  mockAdminUsers,
  mockAdminUserStats
} from '../services/admin.mock';
import type { 
  AdminTrip, 
  AdminTripsStats, 
  AdminExperience, 
  AdminExperiencesStats,
  AdminUser,
  AdminUserStats
} from '../types/admin.types';

interface AdminContextType {
  trips: AdminTrip[];
  tripsStats: AdminTripsStats;
  experiences: AdminExperience[];
  experiencesStats: AdminExperiencesStats;
  users: AdminUser[];
  usersStats: AdminUserStats;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [trips] = useState<AdminTrip[]>(mockAdminTrips);
  const [tripsStats] = useState<AdminTripsStats>(mockAdminTripsStats);
  const [experiences] = useState<AdminExperience[]>(mockAdminExperiences);
  const [experiencesStats] = useState<AdminExperiencesStats>(mockAdminExperiencesStats);
  const [users] = useState<AdminUser[]>(mockAdminUsers);
  const [usersStats] = useState<AdminUserStats>(mockAdminUserStats);

  return (
    <AdminContext.Provider 
      value={{ 
        trips, 
        tripsStats, 
        experiences, 
        experiencesStats, 
        users, 
        usersStats 
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
