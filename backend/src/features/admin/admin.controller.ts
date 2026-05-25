import { Response } from 'express';
import { getAdminTripsService, getAdminUsersService } from './admin.service';
import { AuthRequest } from '../../shared/types';

export const getAdminTrips = async (_req: AuthRequest, res: Response) => {
  try {
    const data = await getAdminTripsService();
    res.json(data);
  } catch (error) {
    console.error('[admin/trips] Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAdminUsers = async (_req: AuthRequest, res: Response) => {
  try {
    const data = await getAdminUsersService();
    res.json(data);
  } catch (error) {
    console.error('[admin/users] Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
