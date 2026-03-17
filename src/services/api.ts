const REST_COUNTRIES_BASE = 'https://restcountries.com/v3.1';

export interface CountryData {
  name: string;
  capital: string;
  region: string;
  population: number;
  flag: string;
  timezones: string[];
  currencies: string[];
  languages: string[];
  latlng: [number, number];
}

export async function fetchCountryByName(name: string): Promise<CountryData | null> {
  try {
    const response = await fetch(`${REST_COUNTRIES_BASE}/name/${name}`);
    if (!response.ok) return null;

    const data = await response.json();
    const country = data[0];

    return {
      name: country.name.common,
      capital: country.capital?.[0] || 'N/A',
      region: country.region,
      population: country.population,
      flag: country.flags?.svg || country.flags?.png || '',
      timezones: country.timezones || [],
      currencies: country.currencies
        ? Object.values(country.currencies).map(
            (c: unknown) => (c as { name: string }).name
          )
        : [],
      languages: country.languages ? Object.values(country.languages) : [],
      latlng: country.latlng || [0, 0],
    };
  } catch (error) {
    console.error('Error fetching country data:', error);
    return null;
  }
}

export async function fetchAllCountries(): Promise<CountryData[]> {
  try {
    const response = await fetch(
      `${REST_COUNTRIES_BASE}/all?fields=name,capital,region,population,flags,timezones,currencies,languages,latlng`
    );
    if (!response.ok) return [];

    const data = await response.json();
    return data.map(
      (country: {
        name: { common: string };
        capital?: string[];
        region: string;
        population: number;
        flags?: { svg?: string; png?: string };
        timezones?: string[];
        currencies?: Record<string, { name: string }>;
        languages?: Record<string, string>;
        latlng?: [number, number];
      }) => ({
        name: country.name.common,
        capital: country.capital?.[0] || 'N/A',
        region: country.region,
        population: country.population,
        flag: country.flags?.svg || country.flags?.png || '',
        timezones: country.timezones || [],
        currencies: country.currencies
          ? Object.values(country.currencies).map((c) => c.name)
          : [],
        languages: country.languages ? Object.values(country.languages) : [],
        latlng: country.latlng || [0, 0],
      })
    );
  } catch (error) {
    console.error('Error fetching countries:', error);
    return [];
  }
}

export function calculateTimeDifference(timezone1: string, timezone2: string): number {
  const parseUtcOffset = (tz: string): number => {
    const match = tz.match(/UTC([+-])(\d{2}):(\d{2})/);
    if (!match) return 0;
    const sign = match[1] === '+' ? 1 : -1;
    const hours = parseInt(match[2]);
    const minutes = parseInt(match[3]);
    return sign * (hours + minutes / 60);
  };

  return parseUtcOffset(timezone2) - parseUtcOffset(timezone1);
}
