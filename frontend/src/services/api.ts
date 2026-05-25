const REST_COUNTRIES_BASE = 'https://restcountries.com/v3.1';

export interface CountryOption {
  name: string;
  flag: string;
  flagImg: string;
}

export async function fetchAllCountries(): Promise<CountryOption[]> {
  try {
    const response = await fetch(
      `${REST_COUNTRIES_BASE}/all?fields=name,flags,flag`
    );
    if (!response.ok) throw new Error('Failed to fetch countries');

    const data = await response.json();
    const countries: CountryOption[] = data
      .map((c: { name: { common: string }; flag?: string; flags?: { svg?: string; png?: string } }) => ({
        name: c.name.common,
        flag: c.flag || '',
        flagImg: c.flags?.svg || c.flags?.png || '',
      }))
      .sort((a: CountryOption, b: CountryOption) => a.name.localeCompare(b.name));

    return countries;
  } catch (error) {
    console.error('Error fetching countries list:', error);
    return [];
  }
}

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
