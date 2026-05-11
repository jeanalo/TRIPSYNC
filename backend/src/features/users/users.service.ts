import { User, UpdateUserRequest } from './users.types';

export const usersMock: User[] = [
  { id: "1", name: "Admin User", email: "admin@tripsync.com", role: "admin", password: "password123" },
  { id: "2", name: "Normal User", email: "user@tripsync.com", role: "user", password: "password123" }
];

export const getUsersService = (): User[] => {
  return usersMock;
};

export const updateUserService = (id: string, data: UpdateUserRequest): User | null => {
  const userIndex = usersMock.findIndex(u => u.id === id);
  if (userIndex === -1) return null;
  
  if (data.fullName) usersMock[userIndex].name = data.fullName;
  if (data.password) usersMock[userIndex].password = data.password;

  return usersMock[userIndex];
};
