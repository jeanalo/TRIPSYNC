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
    return raw ? (JSON.parse(raw) as AuthData) : null;
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
