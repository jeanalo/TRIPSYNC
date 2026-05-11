import { AuthResponse } from './auth.types';

export const getAuthService = (): AuthResponse => {
  return {
    token: "mock-jwt-token-123",
    user: { id: "1", name: "Test User", email: "test@example.com", role: "user" }
  };
};
