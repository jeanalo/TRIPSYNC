import { Search, ChevronDown } from 'lucide-react';
import type { AdminExperienceFilters, SelectOption } from '@/types/admin.types';

interface ExperienceFiltersProps {
  filters: AdminExperienceFilters;
  onFilterChange: (filters: AdminExperienceFilters) => void;
  categoryOptions: SelectOption[];
}

export default function ExperienceFilters({
  filters,
  onFilterChange,
  categoryOptions,
}: ExperienceFiltersProps) {
  const handleChange = (field: keyof AdminExperienceFilters, value: string) => {
    onFilterChange({ ...filters, [field]: value });
  };

  const selectClasses =
    'appearance-none rounded-xl border border-[#e0e0e0] bg-white pl-4 pr-10 py-2.5 text-[14px] text-[#333] outline-none transition-all duration-200 focus:border-[#1CA698] focus:ring-2 focus:ring-[#1CA698]/10 cursor-pointer w-full lg:w-auto';

  return (
    <div className="flex flex-col lg:flex-row items-center gap-4 mb-6">
      {/* Search */}
      <div className="relative w-full lg:flex-1">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999]"
        />
        <input
          type="text"
          placeholder="Search experience..."
          value={filters.search}
          onChange={(e) => handleChange('search', e.target.value)}
          className="w-full rounded-xl border border-[#e0e0e0] bg-white pl-11 pr-4 py-2.5 text-[14px] text-[#333] outline-none transition-all duration-200 focus:border-[#1CA698] focus:ring-2 focus:ring-[#1CA698]/10"
        />
      </div>

      {/* Filters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full lg:w-auto">
        <div className="relative">
          <select
            value={filters.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className={selectClasses}
          >
            <option value="">Category</option>
            {categoryOptions.map((opt) => (
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
            value={filters.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className={selectClasses}
          >
            <option value="">Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
          </select>
          <ChevronDown
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999] pointer-events-none"
          />
        </div>
      </div>
    </div>
  );
}
