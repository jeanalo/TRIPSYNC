import React, { createContext, useContext, useMemo } from 'react';
import axios, { type AxiosInstance } from 'axios';
import { getStoredAuth, setStoredAuth, removeStoredAuth, type AuthData } from '@/lib/storage';

const baseURL = import.meta.env.VITE_API_URL as string;

let _instance: AxiosInstance | null = null;
let refreshPromise: Promise<AuthData> | null = null;

function isTokenExpired(expiresAt: number): boolean {
  return Date.now() / 1000 >= expiresAt - 30;
}

export function getAxiosInstance(): AxiosInstance {
  if (!_instance) throw new Error('AxiosProvider has not mounted yet');
  return _instance;
}

const AxiosContext = createContext<AxiosInstance | undefined>(undefined);

export function AxiosProvider({ children }: { children: React.ReactNode }) {
  const instance = useMemo(() => {
    const ax = axios.create({
      baseURL,
      headers: { 'Content-Type': 'application/json' },
    });

    ax.interceptors.request.use(async (config) => {
      let auth = getStoredAuth();
      if (auth) {
        if (isTokenExpired(auth.session.expires_at)) {
          try {
            refreshPromise ??= axios
              .post<AuthData>(`${baseURL}/api/auth/refresh`, {
                refreshToken: auth.session.refresh_token,
              })
              .then((r) => {
                setStoredAuth(r.data);
                return r.data;
              })
              .finally(() => {
                refreshPromise = null;
              });
            auth = await refreshPromise;
          } catch {
            removeStoredAuth();
            globalThis.location.href = '/login';
            return Promise.reject(new Error('Session expired'));
          }
        }
        config.headers.Authorization = `Bearer ${auth.session.access_token}`;
      }
      return config;
    });

    ax.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 && getStoredAuth()) {
          removeStoredAuth();
          globalThis.location.href = '/login';
          return Promise.reject(new Error('Session expired'));
        }
        const message =
          (error.response?.data as { message?: string })?.message ??
          error.message ??
          'Request failed';
        return Promise.reject(new Error(message));
      },
    );

    _instance = ax;
    return ax;
  }, []);

  return <AxiosContext.Provider value={instance}>{children}</AxiosContext.Provider>;
}

export function useAxios(): AxiosInstance {
  const ctx = useContext(AxiosContext);
  if (!ctx) throw new Error('useAxios must be used within an AxiosProvider');
  return ctx;
}
