const AUTH_KEY = 'tripsync_auth';

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface AuthData {
  session: {
    access_token: string;
    refresh_token: string;
    expires_at: number;
  };
  user?: StoredUser;
}

export function getStoredAuth(): AuthData | null {
  try {
    const raw = sessionStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthData;
    if (!parsed?.session?.access_token) {
      sessionStorage.removeItem(AUTH_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function setStoredAuth(data: AuthData): void {
  sessionStorage.setItem(AUTH_KEY, JSON.stringify(data));
}

export function removeStoredAuth(): void {
  sessionStorage.removeItem(AUTH_KEY);
}
