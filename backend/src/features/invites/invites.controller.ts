import Boom from '@hapi/boom';
import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../../shared/types';
import { createInviteService, getInviteInfoService, joinTripService } from './invites.service';

export const createInvite = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { tripId } = req.params;
    const token = await createInviteService(tripId, req.user!.id);
    res.json({ token });
  } catch (err) {
    next(err);
  }
};

export const getInviteInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.query as { token: string };
    if (!token) return next(Boom.badRequest('Missing token'));
    const info = await getInviteInfoService(token);
    res.json(info);
  } catch (err) {
    next(err);
  }
};

export const joinTrip = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { token } = req.body as { token: string };
    if (!token) return next(Boom.badRequest('Missing token'));
    const tripId = await joinTripService(token, req.user!.id);
    res.json({ tripId });
  } catch (err) {
    next(err);
  }
};
