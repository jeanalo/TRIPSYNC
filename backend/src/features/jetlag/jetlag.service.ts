import { JetlagPlan } from './jetlag.types';

export const getJetlagService = (): JetlagPlan => {
  return {
    departureTime: "08:00 AM",
    arrivalTime: "08:00 PM",
    recommendations: ["Drink water", "Sleep early"]
  };
};
