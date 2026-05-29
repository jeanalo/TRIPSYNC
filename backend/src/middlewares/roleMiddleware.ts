import { Response, NextFunction } from 'express';
import Boom from '@hapi/boom';
import { UserRole } from '../features/users/users.types';
import { AuthRequest } from '../shared/types';

export const requireRole = (role: UserRole) => {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user || !req.user.role) return next(Boom.unauthorized('Unauthorized'));
    if (req.user.role !== role) return next(Boom.forbidden('Forbidden: Insufficient role'));
    next();
  };
};
