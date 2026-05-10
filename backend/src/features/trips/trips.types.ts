export interface Trip {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget?: number;
  originCountry?: string;
  destinationCountry?: string;
}

export interface UpdateTripBudgetRequest {
  budget: number;
}

export interface UpdateTripCountriesRequest {
  originCountry: string;
  destinationCountry: string;
}
