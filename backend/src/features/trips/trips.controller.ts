import { Request, Response } from 'express';
import { getTripsService, updateTripBudgetService, updateTripCountriesService } from './trips.service';

export const getTrips = (req: Request, res: Response) => {
  const trips = getTripsService();
  res.json(trips);
};

export const updateBudget = (req: Request, res: Response) => {
  const { id } = req.params;
  const { budget } = req.body;
  
  if (typeof budget !== 'number') {
    return res.status(400).json({ message: 'Budget must be a number' });
  }

  const updatedTrip = updateTripBudgetService(id, { budget });
  if (!updatedTrip) {
    return res.status(404).json({ message: 'Trip not found' });
  }
  
  res.json({ message: 'Budget updated', trip: updatedTrip });
};

export const updateCountries = (req: Request, res: Response) => {
  const { id } = req.params;
  const { originCountry, destinationCountry } = req.body;
  
  if (!originCountry || !destinationCountry) {
    return res.status(400).json({ message: 'Missing country data' });
  }

  const updatedTrip = updateTripCountriesService(id, { originCountry, destinationCountry });
  if (!updatedTrip) {
    return res.status(404).json({ message: 'Trip not found' });
  }
  
  res.json({ message: 'Countries updated', trip: updatedTrip });
};
