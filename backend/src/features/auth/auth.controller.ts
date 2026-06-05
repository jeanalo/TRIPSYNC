import Boom from '@hapi/boom';
import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../../shared/types';
import { refreshSessionService, registerService, loginService } from './auth.service';

export const getAuth = (req: AuthRequest, res: Response) => {
  res.json({ user: req.user });
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return next(Boom.badRequest('refreshToken required'));
    const session = await refreshSessionService(refreshToken);
    res.json({ session });
  } catch (err) {
    next(err);
  }
};

export const logout = (_req: Request, res: Response) => {
  res.json({ message: 'Logout exitoso' });
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name, role } = req.body;
    const result = await registerService(email, password, name || 'New User', role || 'user');
    res.status(201).json({ message: 'Usuario registrado', ...result });
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const result = await loginService(email, password);
    res.status(200).json({ message: 'Login exitoso', ...result });
  } catch (err) {
    next(err);
  }
};
