import { useState } from 'react';
import DetailCard from '@/components/DetailCard/DetailCard';
import { Search, ChevronDown, Loader2 } from 'lucide-react';
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
        
        <div className="relative">
          <select
            id="admin-search-country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            disabled={loadingCountries}
            className="w-full appearance-none rounded-xl border border-[#e0e0e0] bg-white px-4 py-2.5 text-[14px] text-[#333] outline-none transition-colors duration-200 focus:border-[#1CA698] cursor-pointer disabled:opacity-50"
          >
            <option value="">
              {loadingCountries ? 'Loading countries...' : 'Select a country'}
            </option>
            {countries.map((c) => (
              <option key={c.name} value={c.name}>
                {c.flag} {c.name}
              </option>
            ))}
          </select>
          {loadingCountries ? (
            <Loader2
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999] pointer-events-none animate-spin"
            />
          ) : (
            <ChevronDown
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999] pointer-events-none"
            />
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
