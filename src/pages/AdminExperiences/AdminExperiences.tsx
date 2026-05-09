import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'motion/react';
import { BarChart3, CheckCircle2, Clock, Layers } from 'lucide-react';

import StatsCard from '@/components/admin/StatsCard/StatsCard';
import ExperienceFilters from '@/components/admin/ExperienceFilters/ExperienceFilters';
import ExperienceTable from '@/components/admin/ExperienceTable/ExperienceTable';
import CreateExperienceModal from '@/components/admin/CreateExperienceModal/CreateExperienceModal';
import SuccessModal from '@/components/admin/SuccessModal/SuccessModal';

import {
  mockAdminExperiences,
  mockAdminExperiencesStats,
  mockCategoryOptions,
  mockCityOptions,
  mockCountryOptions,
} from '@/services/admin.mock';

import type {
  AdminExperienceFilters,
  CreateExperienceFormData,
} from '@/types/admin.types';

interface AdminLayoutOutletContext {
  isCreateModalRequested: boolean;
  resetCreateModalRequest: () => void;
}

export default function AdminExperiences() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [filters, setFilters] = useState<AdminExperienceFilters>({
    search: '',
    category: '',
    city: '',
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

  const filteredExperiences = mockAdminExperiences.filter((exp) => {
    const matchesSearch = exp.name.toLowerCase().includes(filters.search.toLowerCase());
    const matchesCategory = !filters.category || exp.category.toLowerCase() === filters.category.toLowerCase();
    const matchesCity = !filters.city || exp.city.toLowerCase() === filters.city.toLowerCase();
    const matchesStatus = !filters.status || exp.status === filters.status;
    return matchesSearch && matchesCategory && matchesCity && matchesStatus;
  });

  return (
    <div className="flex flex-col">
      {/* Page Header */}
      <motion.div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-7"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-[26px] font-bold text-[#0066D2] leading-tight">
            Experiences
          </h1>
          <p className="text-[14px] text-[#0066D2]/60 mt-1">
            Manage your platform's catalog and review new proposals
          </p>
        </div>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-7">
        <StatsCard
          icon={<Layers size={22} />}
          label="Total experiences"
          value={mockAdminExperiencesStats.totalExperiences}
          delay={0.1}
        />
        <StatsCard
          icon={<CheckCircle2 size={22} />}
          label="Active experiences"
          value={mockAdminExperiencesStats.activeExperiences}
          delay={0.2}
        />
        <StatsCard
          icon={<Clock size={22} />}
          label="Pending approval"
          value={mockAdminExperiencesStats.pendingApproval}
          delay={0.3}
        />
        <StatsCard
          icon={<BarChart3 size={22} />}
          label="Popular category"
          value={mockAdminExperiencesStats.mostPopularCategory}
          delay={0.4}
        />
      </div>

      {/* Main Content Card */}
      <div className="bg-[#F5F7FA] rounded-3xl p-1">
        <ExperienceFilters
          filters={filters}
          onFilterChange={setFilters}
          categoryOptions={mockCategoryOptions}
          cityOptions={mockCityOptions}
        />
        
        <ExperienceTable
          experiences={filteredExperiences}
          onEdit={(id) => console.log('Edit', id)}
          onDelete={(id) => console.log('Delete', id)}
          onView={(id) => console.log('View', id)}
        />
      </div>

      {/* Modals */}
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
