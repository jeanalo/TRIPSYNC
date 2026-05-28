import { Response, NextFunction } from 'express';
import { UserRole } from '../features/users/users.types';
import { AuthRequest } from '../shared/types';

export const requireRole = (role: UserRole) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (req.user.role !== role) {
      return res.status(403).json({ message: 'Forbidden: Insufficient role' });
    }

    next();
  };
};
