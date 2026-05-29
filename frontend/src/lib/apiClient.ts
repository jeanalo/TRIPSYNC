import axios from 'axios';
import { supabase } from './supabase';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
  headers: { 'Content-Type': 'application/json' },
});

// Inject the Supabase access token on every request
axiosInstance.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});

// Handle expired / invalid sessions
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await supabase.auth.signOut();
    }
    const message =
      error.response?.data?.error?.message ??
      error.response?.data?.message ??
      error.message ??
      `HTTP ${error.response?.status ?? 'unknown'}`;
    return Promise.reject(new Error(message));
  },
);

// Wrapper that unwraps .data to match the previous Fetch-based interface
export const apiClient = {
  get: <T>(path: string) => axiosInstance.get<T>(path).then((r) => r.data),
  post: <T>(path: string, body?: unknown) => axiosInstance.post<T>(path, body).then((r) => r.data),
  put: <T>(path: string, body?: unknown) => axiosInstance.put<T>(path, body).then((r) => r.data),
  delete: <T>(path: string) => axiosInstance.delete<T>(path).then((r) => r.data),
};
