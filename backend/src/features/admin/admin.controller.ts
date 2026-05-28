import { Response, NextFunction } from 'express';
import { getAdminTripsService, getAdminUsersService } from './admin.service';
import { AuthRequest } from '../../shared/types';

export const getAdminTrips = async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = await getAdminTripsService();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const getAdminUsers = async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = await getAdminUsersService();
    res.json(data);
  } catch (err) {
    next(err);
  }
};
