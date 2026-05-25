import { Request, Response } from 'express';
import { AuthRequest } from '../../shared/types';
import { createInviteService, getInviteInfoService, joinTripService } from './invites.service';

export const createInvite = async (req: AuthRequest, res: Response) => {
  try {
    const { tripId } = req.params;
    const token = await createInviteService(tripId, req.user!.id);
    res.json({ token });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal server error';
    if (msg === 'Trip not found') return res.status(404).json({ message: msg });
    if (msg === 'Forbidden') return res.status(403).json({ message: msg });
    res.status(500).json({ message: msg });
  }
};

export const getInviteInfo = async (req: Request, res: Response) => {
  try {
    const { token } = req.query as { token: string };
    if (!token) return res.status(400).json({ message: 'Missing token' });
    const info = await getInviteInfoService(token);
    res.json(info);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal server error';
    const status = ['Invalid invite token', 'Invite already used', 'Invite expired'].includes(msg) ? 400 : 500;
    res.status(status).json({ message: msg });
  }
};

export const joinTrip = async (req: AuthRequest, res: Response) => {
  try {
    const { token } = req.body as { token: string };
    if (!token) return res.status(400).json({ message: 'Missing token' });
    const tripId = await joinTripService(token, req.user!.id);
    res.json({ tripId });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal server error';
    const clientErrors = ['Invalid invite token', 'Invite already used', 'Invite expired', 'You are the owner of this trip', 'Already a member of this trip'];
    const status = clientErrors.includes(msg) ? 400 : 500;
    res.status(status).json({ message: msg });
  }
};
