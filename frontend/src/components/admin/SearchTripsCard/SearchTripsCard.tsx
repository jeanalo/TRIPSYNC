import { useState, useEffect, useRef, useMemo } from 'react';
import DetailCard from '@/components/DetailCard/DetailCard';
import { Search, Loader2 } from 'lucide-react';
import { useCountries } from '@/hooks/useCountries';
import type { SearchTripsFilters } from '@/types/admin.types';

interface SearchTripsCardProps {
  onSearch?: (filters: SearchTripsFilters) => void;
  loading?: boolean;
}

export default function SearchTripsCard({
  onSearch,
  loading = false,
}: SearchTripsCardProps) {
  const { countries, loading: loadingCountries } = useCountries();
  const [country, setCountry] = useState('');
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) setSearch(country);
  }, [country, open]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return q ? countries.filter((c) => c.name.toLowerCase().includes(q)) : countries;
  }, [countries, search]);

  const handleSearch = () => {
    if (!country) return;
    onSearch?.({ country });
  };

  return (
    <DetailCard delay={0.4}>
      <h3 className="text-[18px] font-bold text-[#0066D2] mb-5">
        Search Trips
      </h3>

      <div className="flex flex-col gap-3">
        <div ref={ref} className="relative">
          <input
            type="text"
            value={search}
            onFocus={() => { setOpen(true); setSearch(''); }}
            onChange={(e) => {
              setSearch(e.target.value);
              setOpen(true);
              if (!e.target.value) setCountry('');
            }}
            placeholder={loadingCountries ? 'Loading countries...' : 'Search a country...'}
            disabled={loadingCountries}
            className="w-full rounded-xl border-2 border-[#0066D2] bg-white px-4 py-2.5 text-[14px] text-[#0066D2] placeholder-[#0066D2]/50 outline-none transition-colors duration-200 focus:border-[#0066D2] disabled:opacity-50"
          />
          {loadingCountries && (
            <Loader2
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999] pointer-events-none animate-spin"
            />
          )}
          {open && !loadingCountries && (
            <div className="absolute left-0 top-full z-50 mt-1 max-h-[220px] w-full overflow-y-auto rounded-xl border border-[#0066D2]/30 bg-white shadow-lg">
              {filtered.length === 0 ? (
                <p className="p-3 text-center text-[14px] text-[#0066D2]/60">No results</p>
              ) : (
                filtered.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => { setCountry(c.name); setSearch(c.name); setOpen(false); }}
                    className="flex w-full items-center gap-3 px-4 py-2 text-left transition-colors hover:bg-[#0066D2]/10"
                  >
                    <span className="text-lg">{c.flag}</span>
                    <span className="text-[14px] text-gray-800">{c.name}</span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleSearch}
          disabled={!country || loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0066D2] px-4 py-2.5 text-[14px] font-semibold text-white border-none cursor-pointer transition-all duration-200 hover:bg-[#0055b0] hover:shadow-md mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Search size={16} />
          )}
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>
    </DetailCard>
  );
}
