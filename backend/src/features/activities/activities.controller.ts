import { Request, Response } from 'express';
import { getActivitiesService, deleteActivityService } from './activities.service';

export const getActivities = (req: Request, res: Response) => {
  const activities = getActivitiesService();
  res.json(activities);
};

export const deleteActivity = (req: Request, res: Response) => {
  const { id } = req.params;
  const success = deleteActivityService(id);
  if (!success) {
    return res.status(404).json({ message: 'Activity not found' });
  }
  res.json({ message: 'Activity deleted' });
};
