import { Response } from 'express';
import { getActivitiesByUserService, createActivityService, deleteActivityService } from './activities.service';
import { AuthRequest } from '../../shared/types';

export const getActivities = async (req: AuthRequest, res: Response) => {
  try {
    const activities = await getActivitiesByUserService(req.user!.id);
    res.json(activities);
  } catch {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createActivity = async (req: AuthRequest, res: Response) => {
  try {
    const { name, date, time, location, category, notes, trip_id } = req.body;

    if (!name || !date || !time) {
      return res.status(400).json({ message: 'Missing required fields: name, date, time' });
    }

    const activity = await createActivityService(req.user!.id, {
      name,
      date,
      time,
      location,
      category,
      notes,
      trip_id: trip_id ?? null,
    });
    res.status(201).json(activity);
  } catch {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteActivity = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const success = await deleteActivityService(id, req.user!.id);
    if (!success) return res.status(404).json({ message: 'Activity not found' });
    res.json({ message: 'Activity deleted' });
  } catch {
    res.status(500).json({ message: 'Internal server error' });
  }
};
