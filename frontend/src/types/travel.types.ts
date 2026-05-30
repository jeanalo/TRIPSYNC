export type Expense = {
  id: string;
  amount: number;
  category: string;
  date: string;
  notes: string;
};

export type Activity = {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  category: string;
  notes: string;
};

export type Experience = {
  id: string;
  name: string;
  location: string;
  category: 'Chill' | 'Adventure' | 'Cultural' | 'Free Tour';
  image: string;
  saved: boolean;
};

export type TripDetails = {
  departureCountry: string;
  destinationCountry: string;
  departureDate: string;
  arrivalDate: string;
  budget: number;
  userIdOwner?: string;
};

export type Recommendation = {
  title: string;
  desc: string;
};

export type JetLagPlan = {
  departureTime: string;
  arrivalTime: string;
  recommendations: Recommendation[] | null;
};
