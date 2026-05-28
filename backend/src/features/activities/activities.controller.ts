import Boom from '@hapi/boom';
import { Response, NextFunction } from 'express';
import { getActivitiesByUserService, getActivitiesByTripService, createActivityService, deleteActivityService } from './activities.service';
import { AuthRequest } from '../../shared/types';

export const getActivities = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { tripId } = req.query;
    let activities;
    if (tripId && typeof tripId === 'string') {
      activities = await getActivitiesByTripService(tripId, req.user!.id);
    } else {
      activities = await getActivitiesByUserService(req.user!.id);
    }
    res.json(activities);
  } catch (err) {
    next(err);
  }
};

export const createActivity = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { name, date, time, location, category, notes, trip_id } = req.body;

    if (!name || !date || !time) {
      return next(Boom.badRequest('Missing required fields: name, date, time'));
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
  } catch (err) {
    next(err);
  }
};

export const deleteActivity = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await deleteActivityService(id, req.user!.id);
    res.json({ message: 'Activity deleted' });
  } catch (err) {
    next(err);
  }
};
