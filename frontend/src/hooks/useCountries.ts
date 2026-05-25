import { useState, useEffect } from 'react';
import { fetchAllCountries, type CountryOption } from '../services/api';

let cache: CountryOption[] | null = null;
let promise: Promise<CountryOption[]> | null = null;

export function useCountries() {
  const [countries, setCountries] = useState(cache ?? []);
  const [loading, setLoading] = useState(!cache);

  useEffect(() => {
    if (cache) return;
    if (!promise) promise = fetchAllCountries().then((d) => (cache = d));
    let live = true;
    promise.then((d) => live && (setCountries(d), setLoading(false)));
    return () => { live = false; };
  }, []);

  return { countries, loading };
}
