import { Activity } from './activities.types';

let activitiesMock: Activity[] = [
  { id: "1", name: "City Tour", date: "2026-06-03", time: "10:00 AM" }
];

export const getActivitiesService = (): Activity[] => {
  return activitiesMock;
};

export const deleteActivityService = (id: string): boolean => {
  const initialLength = activitiesMock.length;
  activitiesMock = activitiesMock.filter(a => a.id !== id);
  return activitiesMock.length < initialLength;
};
