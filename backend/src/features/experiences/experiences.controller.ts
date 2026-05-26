import Boom from "@hapi/boom";
import { Request, Response, NextFunction } from "express";
import {
  getExperiencesService,
  createExperienceService,
} from "./experiences.service";

export const getExperiences = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const experiences = await getExperiencesService();
    res.json(experiences);
  } catch (err) {
    next(err);
  }
};

export const createExperience = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {
    name,
    country,
    location,
    category,
    image,
    duration,
    difficulty,
    description,
    eco,
    highlights,
    included,
    tips,
  } = req.body;
  if (
    !name ||
    !country ||
    !location ||
    !category ||
    !image ||
    !duration ||
    !difficulty ||
    !description
  ) {
    return next(Boom.badRequest("Missing required fields"));
  }
  try {
    const newExp = await createExperienceService({
      name,
      country,
      location,
      category,
      image,
      duration,
      difficulty,
      description,
      eco: eco ?? "",
      highlights: highlights ?? [],
      included: included ?? [],
      tips: tips ?? [],
    });
    res.status(201).json({ message: "Experience created", experience: newExp });
  } catch (err) {
    next(err);
  }
};
