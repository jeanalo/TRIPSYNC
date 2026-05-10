import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'motion/react';
import { Users, UserPlus, TrendingUp, Globe } from 'lucide-react';

import StatsCard from '@/components/admin/StatsCard/StatsCard';
import UserFilters from '@/components/admin/UserFilters/UserFilters';
import UsersTable from '@/components/admin/UsersTable/UsersTable';
import CreateExperienceModal from '@/components/admin/CreateExperienceModal/CreateExperienceModal';
import SuccessModal from '@/components/admin/SuccessModal/SuccessModal';

import {
  mockAdminUsers,
  mockAdminUserStats,
  mockCountryOptions,
  mockCityOptions,
  mockCategoryOptions,
} from '@/services/admin.mock';

import type {
  AdminUserFilters,
  CreateExperienceFormData,
} from '@/types/admin.types';

interface AdminLayoutOutletContext {
  isCreateModalRequested: boolean;
  resetCreateModalRequest: () => void;
}

export default function AdminUsers() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [filters, setFilters] = useState<AdminUserFilters>({
    search: '',
    country: '',
    status: '',
  });

  const outletContext = useOutletContext<AdminLayoutOutletContext>();

  useEffect(() => {
    if (outletContext?.isCreateModalRequested) {
      setIsCreateModalOpen(true);
      outletContext.resetCreateModalRequest();
    }
  }, [outletContext?.isCreateModalRequested]);

  const handleCreateSubmit = (data: CreateExperienceFormData) => {
    console.log('Experience created:', data);
    setIsCreateModalOpen(false);
    setIsSuccessModalOpen(true);
  };

  const filteredUsers = mockAdminUsers.filter((user) => {
    const matchesSearch = 
      user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      user.email.toLowerCase().includes(filters.search.toLowerCase()) ||
      user.id.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesCountry = !filters.country || 
      user.country.toLowerCase() === filters.country.toLowerCase();
    
    const matchesStatus = !filters.status || user.status === filters.status;

    return matchesSearch && matchesCountry && matchesStatus;
  });

  return (
    <div className="flex flex-col">
      
      <motion.div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-7"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-[26px] font-bold text-[#0066D2] leading-tight">
            Users
          </h1>
          <p className="text-[14px] text-[#0066D2]/60 mt-1">
            Manage travelers and platform members
          </p>
        </div>
      </motion.div>

      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-7">
        <StatsCard
          icon={<Users size={22} />}
          label="Total users"
          value={mockAdminUserStats.totalUsers}
          delay={0.1}
        />
        <StatsCard
          icon={<TrendingUp size={22} />}
          label="Active users"
          value={mockAdminUserStats.activeUsers}
          delay={0.2}
        />
        <StatsCard
          icon={<UserPlus size={22} />}
          label="New this month"
          value={mockAdminUserStats.newThisMonth}
          delay={0.3}
        />
        <StatsCard
          icon={<Globe size={22} />}
          label="Top country"
          value={mockAdminUserStats.topCountry}
          delay={0.4}
        />
      </div>

     
      <div className="bg-[#F5F7FA] rounded-3xl p-1">
        <UserFilters
          filters={filters}
          onFilterChange={setFilters}
          countryOptions={mockCountryOptions}
        />
        
        <UsersTable
          users={filteredUsers}
          onEdit={(id) => console.log('Edit', id)}
          onDelete={(id) => console.log('Delete', id)}
          onView={(id) => console.log('View', id)}
        />
      </div>

        
      <CreateExperienceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateSubmit}
        countryOptions={mockCountryOptions}
        cityOptions={mockCityOptions}
        categoryOptions={mockCategoryOptions}
      />

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
      />
    </div>
  );
}
