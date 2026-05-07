import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { getUsersService, updateUserService } from './users.service';
import { AuthRequest } from '../../shared/types';

export const getUsers = (req: Request, res: Response) => {
  const users = getUsersService();
  res.json(users);
};

export const updateUser = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { fullName, password } = req.body;

  if (req.user?.id !== id && req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  let hashedPassword;
  if (password) {
    hashedPassword = await bcrypt.hash(password, 10);
  }

  const updatedUser = updateUserService(id, {
    fullName,
    password: hashedPassword
  });

  if (!updatedUser) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json({ message: 'User updated', user: { id: updatedUser.id, name: updatedUser.name, email: updatedUser.email } });
};
