import React from 'react';
import { AuthProvider } from './AuthProvider';
import { AdminProvider } from './AdminProvider';
import TripProvider from './TripProvider';
import ExpenseActivityProvider from './ExpenseActivityProvider';
import { RealtimeProvider } from './RealtimeProvider';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminProvider>
        <TripProvider>
          <ExpenseActivityProvider>
            <RealtimeProvider>
              {children}
            </RealtimeProvider>
          </ExpenseActivityProvider>
        </TripProvider>
      </AdminProvider>
    </AuthProvider>
  );
}
