import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, ChevronDown } from 'lucide-react';
import type { SearchTripsFilters, SelectOption } from '@/types/admin.types';

interface SearchTripsCardProps {
  countryOptions: SelectOption[];
  cityOptions: SelectOption[];
  onSearch?: (filters: SearchTripsFilters) => void;
}

export default function SearchTripsCard({
  countryOptions,
  cityOptions,
  onSearch,
}: SearchTripsCardProps) {
  const [filters, setFilters] = useState<SearchTripsFilters>({
    country: '',
    city: '',
    travelDate: '',
  });

  const handleChange = (field: keyof SearchTripsFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    onSearch?.(filters);
  };

  return (
    <motion.div
      className="rounded-2xl border border-[#e0e0e0] bg-white p-6 shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
    >
      
      <h3 className="text-[18px] font-bold text-[#0066D2] mb-5">
        Search Trips
      </h3>

      
      <div className="flex flex-col gap-3">
        
        <div className="relative">
          <select
            id="admin-search-country"
            value={filters.country}
            onChange={(e) => handleChange('country', e.target.value)}
            className="w-full appearance-none rounded-xl border border-[#e0e0e0] bg-white px-4 py-2.5 text-[14px] text-[#333] outline-none transition-colors duration-200 focus:border-[#1CA698] cursor-pointer"
          >
            <option value="">Country</option>
            {countryOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999] pointer-events-none"
          />
        </div>

        
        <div className="relative">
          <select
            id="admin-search-city"
            value={filters.city}
            onChange={(e) => handleChange('city', e.target.value)}
            className="w-full appearance-none rounded-xl border border-[#e0e0e0] bg-white px-4 py-2.5 text-[14px] text-[#333] outline-none transition-colors duration-200 focus:border-[#1CA698] cursor-pointer"
          >
            <option value="">City</option>
            {cityOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999] pointer-events-none"
          />
        </div>

        
        <input
          id="admin-search-date"
          type="date"
          value={filters.travelDate}
          onChange={(e) => handleChange('travelDate', e.target.value)}
          className="w-full rounded-xl border border-[#e0e0e0] bg-white px-4 py-2.5 text-[14px] text-[#333] outline-none transition-colors duration-200 focus:border-[#1CA698]"
          placeholder="Travel Date"
        />

        
        <button
          type="button"
          onClick={handleSearch}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0066D2] px-4 py-2.5 text-[14px] font-semibold text-white border-none cursor-pointer transition-all duration-200 hover:bg-[#0055b0] hover:shadow-md mt-1"
        >
          <Search size={16} />
          Search
        </button>
      </div>
    </motion.div>
  );
}
