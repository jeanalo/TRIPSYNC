import { Request, Response } from 'express';
import { getUsersService, updateUserService } from './users.service';
import { AuthRequest } from '../../shared/types';

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await getUsersService();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo usuarios' });
  }
};

export const updateUser = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { fullName, password } = req.body;

  if (req.user?.id !== id && req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const updatedUser = await updateUserService(id, { fullName, password });

  if (!updatedUser) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json({ message: 'User updated', user: { id: updatedUser.id, name: updatedUser.name, email: updatedUser.email } });
};
