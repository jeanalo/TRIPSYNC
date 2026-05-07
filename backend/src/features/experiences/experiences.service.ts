import { Experience, CreateExperienceRequest } from './experiences.types';

const experiencesMock: Experience[] = [
  { id: "1", title: "Sunset Kayaking", location: "Blue Bay", category: "Adventure" }
];

export const getExperiencesService = (): Experience[] => {
  return experiencesMock;
};

export const createExperienceService = (data: CreateExperienceRequest): Experience => {
  const newExp: Experience = {
    id: Math.random().toString(36).substring(7),
    ...data,
    location: `${data.city}, ${data.country}`
  };
  experiencesMock.push(newExp);
  return newExp;
};
