import { Search, ChevronDown } from 'lucide-react';
import type { AdminUserFilters, SelectOption } from '@/types/admin.types';

interface UserFiltersProps {
  filters: AdminUserFilters;
  onFilterChange: (filters: AdminUserFilters) => void;
  countryOptions: SelectOption[];
}

export default function UserFilters({
  filters,
  onFilterChange,
  countryOptions,
}: UserFiltersProps) {
  const handleChange = (field: keyof AdminUserFilters, value: string) => {
    onFilterChange({ ...filters, [field]: value });
  };

  const selectClasses =
    'appearance-none rounded-xl border-2 border-[#0066D2] bg-white pl-4 pr-10 py-2.5 text-[14px] text-[#0066D2] outline-none transition-all duration-200 focus:border-[#0066D2] focus:ring-0 cursor-pointer w-full lg:w-auto';

  return (
    <div className="flex flex-col lg:flex-row items-center gap-4 mb-6">
      <div className="relative w-full lg:flex-1">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0066D2]"
        />

        <input
          type="text"
          placeholder="Search user..."
          value={filters.search}
          onChange={(e) => handleChange('search', e.target.value)}
          className="w-full rounded-xl border-2 border-[#0066D2] bg-white pl-11 pr-4 py-2.5 text-[14px] text-[#0066D2] placeholder:text-[#0066D2] outline-none transition-all duration-200 focus:border-[#0066D2] focus:ring-0"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full lg:w-auto">
        <div className="relative">
          <select
            value={filters.country}
            onChange={(e) => handleChange('country', e.target.value)}
            className={selectClasses}
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
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0066D2] pointer-events-none"
          />
        </div>

        <div className="relative">
          <select
            value={filters.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className={selectClasses}
          >
            <option value="">Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="premium">Premium</option>
          </select>

          <ChevronDown
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0066D2] pointer-events-none"
          />
        </div>
      </div>
    </div>
  );
}