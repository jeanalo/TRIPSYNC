import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../shared/types';
import { UserRole } from '../features/users/users.types';

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, 'secretkey') as { id: string, email: string, role: UserRole };
    
    req.user = {
      id: decoded.id,
      email: decoded.email,
      name: "Mock User",
      role: decoded.role
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
