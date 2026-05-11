import { Trip, UpdateTripBudgetRequest, UpdateTripCountriesRequest } from './trips.types';

const tripsMock: Trip[] = [
  {
    id: "1",
    destination: "Argentina",
    startDate: "2026-06-01",
    endDate: "2026-06-10"
  }
];

export const getTripsService = (): Trip[] => {
  return tripsMock;
};

export const updateTripBudgetService = (id: string, data: UpdateTripBudgetRequest): Trip | null => {
  const trip = tripsMock.find(t => t.id === id);
  if (!trip) return null;
  trip.budget = data.budget;
  return trip;
};

export const updateTripCountriesService = (id: string, data: UpdateTripCountriesRequest): Trip | null => {
  const trip = tripsMock.find(t => t.id === id);
  if (!trip) return null;
  trip.originCountry = data.originCountry;
  trip.destinationCountry = data.destinationCountry;
  return trip;
};
