import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAxios } from './AxiosProvider';
import { getStoredAuth, setStoredAuth, removeStoredAuth } from '@/lib/storage';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  register: (email: string, name: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  registerAdmin: (email: string, name: string, password: string) => Promise<void>;
  loginAdmin: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (name: string, password?: string) => Promise<void>;
}

interface AuthResponse {
  session: {
    access_token: string;
    refresh_token: string;
    expires_at: number;
  };
  user: User;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function decodeJwt(token: string): Record<string, unknown> {
  try {
    const payload = token.split('.')[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return {};
  }
}

function userFromToken(token: string): User | null {
  const p = decodeJwt(token) as {
    sub?: string;
    email?: string;
    user_metadata?: { full_name?: string; name?: string; role?: string };
  };
  if (!p.sub) return null;
  return {
    id: p.sub,
    email: p.email ?? '',
    name: p.user_metadata?.full_name ?? p.user_metadata?.name ?? p.email ?? '',
    role: p.user_metadata?.role === 'admin' ? 'admin' : 'user',
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const ax = useAxios();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getStoredAuth();
    if (auth?.session?.access_token) {
      setUser(auth.user ?? userFromToken(auth.session.access_token));
    }
    setLoading(false);
  }, []);

  const register = async (email: string, name: string, password: string) => {
    const { data } = await ax.post<AuthResponse>('/api/auth/register', {
      email,
      name,
      password,
    });
    setStoredAuth({ session: data.session, user: data.user });
    setUser(data.user);
  };

  const login = async (email: string, password: string) => {
    const { data } = await ax.post<AuthResponse>('/api/auth/login', {
      email,
      password,
    });
    if (data.user.role === 'admin') {
      throw new Error('Esta cuenta es de administrador. Usa el acceso de administrador.');
    }
    setStoredAuth({ session: data.session, user: data.user });
    setUser(data.user);
  };

  const registerAdmin = async (email: string, name: string, password: string) => {
    const { data } = await ax.post<AuthResponse>('/api/auth/register', {
      email,
      name,
      password,
      role: 'admin',
    });
    setStoredAuth({ session: data.session, user: data.user });
    setUser(data.user);
  };

  const loginAdmin = async (email: string, password: string) => {
    const { data } = await ax.post<AuthResponse>('/api/auth/login', {
      email,
      password,
    });
    if (data.user.role !== 'admin') {
      throw new Error('No tienes permisos de administrador.');
    }
    setStoredAuth({ session: data.session, user: data.user });
    setUser(data.user);
  };

  const logout = async () => {
    try {
      await ax.post('/api/auth/logout');
    } finally {
      removeStoredAuth();
      setUser(null);
      navigate('/login');
    }
  };

  const updateUser = async (name: string, password?: string) => {
    const currentUser = user!;
    const { data } = await ax.patch<{ user: User }>(`/api/users/${currentUser.id}`, {
      fullName: name,
      ...(password ? { password } : {}),
    });
    const updatedUser = { ...data.user, role: data.user.role ?? currentUser.role };
    const auth = getStoredAuth();
    if (auth) setStoredAuth({ ...auth, user: updatedUser });
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, register, login, registerAdmin, loginAdmin, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
