import { Response } from 'express';
import { getTripByUserService, upsertTripService } from './trips.service';
import { AuthRequest } from '../../shared/types';

export const getMyTrip = async (req: AuthRequest, res: Response) => {
  try {
    const trip = await getTripByUserService(req.user!.id);
    if (!trip) return res.status(404).json({ message: 'No trip found' });
    res.json(trip);
  } catch {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const upsertTrip = async (req: AuthRequest, res: Response) => {
  try {
    const { id, departure_country, destination_country, departure_date, arrival_date, budget, jet_lag_plan } = req.body;

    if (!departure_country || !destination_country || !departure_date || !arrival_date) {
      return res.status(400).json({ message: 'Missing required fields: departure_country, destination_country, departure_date, arrival_date' });
    }

    const trip = await upsertTripService(req.user!.id, {
      id,
      departure_country,
      destination_country,
      departure_date,
      arrival_date,
      budget: Number(budget) || 0,
      jet_lag_plan,
    });

    res.json(trip);
  } catch {
    res.status(500).json({ message: 'Internal server error' });
  }
};
