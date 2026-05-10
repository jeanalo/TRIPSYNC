import React from 'react';
import { AuthProvider } from './AuthProvider';
import { AdminProvider } from './AdminProvider';
import { TravelProvider } from './TravelProvider';
import { RealtimeProvider } from './RealtimeProvider';

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminProvider>
        <TravelProvider>
          <RealtimeProvider>
            {children}
          </RealtimeProvider>
        </TravelProvider>
      </AdminProvider>
    </AuthProvider>
  );
}
