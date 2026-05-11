import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

import PageHeader from '@/components/PageHeader/PageHeader';

import UserFilters from '@/components/admin/UserFilters/UserFilters';
import UsersTable from '@/components/admin/UsersTable/UsersTable';
import CreateExperienceModal from '@/components/admin/CreateExperienceModal/CreateExperienceModal';
import SuccessModal from '@/components/admin/SuccessModal/SuccessModal';

import { useAdmin } from '@/providers/AdminProvider';
import {
  mockCountryOptions,
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
  const { users } = useAdmin();
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
    setIsCreateModalOpen(false);
    setIsSuccessModalOpen(true);
  };

  const filteredUsers = users.filter((user) => {
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
      <PageHeader
        title="Users"
        subtitle="Manage travelers and platform members"
        className="mb-7"
      />

      <div className="bg-[#F5F7FA] rounded-3xl p-1">
        <UserFilters
          filters={filters}
          onFilterChange={setFilters}
          countryOptions={mockCountryOptions}
        />
        
        <UsersTable
          users={filteredUsers}
        />
      </div>

      <CreateExperienceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateSubmit}
        categoryOptions={mockCategoryOptions}
      />

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
      />
    </div>
  );
}
