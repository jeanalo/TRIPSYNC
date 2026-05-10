import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  register: (email: string, name: string) => void;
  login: (email: string) => void;
  logout: () => void;
  updateUser: (name: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const register = (email: string, name: string) => {
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
    registeredUsers[email] = { name, email };
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
  };

  const login = (email: string) => {
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
    const registered = registeredUsers[email];
    setUser({ name: registered?.name || email, email });
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = (name: string) => {
    if (!user) return;
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
    registeredUsers[user.email] = { ...registeredUsers[user.email], name };
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    setUser({ ...user, name });
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout, updateUser }}>
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
