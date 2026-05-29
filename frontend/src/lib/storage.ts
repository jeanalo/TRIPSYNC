const AUTH_KEY = 'tripsync_auth';

export interface AuthData {
  session: {
    access_token: string;
    refresh_token: string;
    expires_at: number;
  };
}

export function getStoredAuth(): AuthData | null {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthData;
    if (!parsed?.session?.access_token) {
      localStorage.removeItem(AUTH_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function setStoredAuth(data: AuthData): void {
  localStorage.setItem(AUTH_KEY, JSON.stringify(data));
}

export function removeStoredAuth(): void {
  localStorage.removeItem(AUTH_KEY);
}
