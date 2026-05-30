import Boom from '@hapi/boom';
import { Request, Response, NextFunction } from 'express';
import { getUsersService, updateUserService } from './users.service';
import { AuthRequest } from '../../shared/types';

export const getUsers = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await getUsersService();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { fullName, password } = req.body;

    if (req.user?.id !== id && req.user?.role !== 'admin') {
      return next(Boom.forbidden('Forbidden'));
    }

    const updatedUser = await updateUserService(id, { fullName, password });
    res.json({ message: 'User updated', user: { id: updatedUser.id, name: updatedUser.name, email: updatedUser.email, role: updatedUser.role } });
  } catch (err) {
    next(err);
  }
};
