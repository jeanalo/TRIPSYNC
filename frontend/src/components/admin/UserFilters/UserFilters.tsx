import { Search } from 'lucide-react';
import type { AdminUserFilters } from '@/types/admin.types';

interface UserFiltersProps {
  filters: AdminUserFilters;
  onFilterChange: (filters: AdminUserFilters) => void;
}

export default function UserFilters({
  filters,
  onFilterChange,
}: UserFiltersProps) {
  return (
    <div className="mb-6">
      <div className="relative">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0066D2]"
        />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={filters.search}
          onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
          className="w-full rounded-xl border-2 border-[#0066D2] bg-white pl-11 pr-4 py-2.5 text-[14px] text-[#0066D2] placeholder:text-[#0066D2]/50 outline-none transition-all duration-200 focus:border-[#0066D2] focus:ring-0"
        />
      </div>
    </div>
  );
}
