import { Request, Response } from 'express';
import { getExperiencesService, createExperienceService } from './experiences.service';

export const getExperiences = (req: Request, res: Response) => {
  const experiences = getExperiencesService();
  res.json(experiences);
};

export const createExperience = (req: Request, res: Response) => {
  const { title, description, country, city, price, category, imageUrl } = req.body;
  if (!title || !description || !country || !city || price === undefined || !category || !imageUrl) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  const newExp = createExperienceService(req.body);
  res.status(201).json({ message: 'Experience created', experience: newExp });
};
