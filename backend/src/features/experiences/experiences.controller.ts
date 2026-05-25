import Boom from '@hapi/boom';
import { Request, Response, NextFunction } from 'express';
import { getExperiencesService, createExperienceService } from './experiences.service';

export const getExperiences = (_req: Request, res: Response) => {
  const experiences = getExperiencesService();
  res.json(experiences);
};

export const createExperience = (req: Request, res: Response, next: NextFunction) => {
  const { title, description, country, city, price, category, imageUrl } = req.body;
  if (!title || !description || !country || !city || price === undefined || !category || !imageUrl) {
    return next(Boom.badRequest('Missing required fields'));
  }
  const newExp = createExperienceService(req.body);
  res.status(201).json({ message: 'Experience created', experience: newExp });
};
