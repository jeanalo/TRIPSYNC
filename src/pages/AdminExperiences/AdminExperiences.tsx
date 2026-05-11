import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'motion/react';
import { BarChart3, CheckCircle2, Clock, Layers } from 'lucide-react';

import StatsCard from '@/components/admin/StatsCard/StatsCard';
import ExperienceFilters from '@/components/admin/ExperienceFilters/ExperienceFilters';
import ExperienceTable from '@/components/admin/ExperienceTable/ExperienceTable';
import CreateExperienceModal from '@/components/admin/CreateExperienceModal/CreateExperienceModal';
import SuccessModal from '@/components/admin/SuccessModal/SuccessModal';

import { useAdmin } from '@/providers/AdminProvider';
import { mockCategoryOptions } from '@/services/admin.mock';

import type {
  AdminExperienceFilters,
  CreateExperienceFormData,
} from '@/types/admin.types';

interface AdminLayoutOutletContext {
  isCreateModalRequested: boolean;
  resetCreateModalRequest: () => void;
}

export default function AdminExperiences() {
  const { experiences, experiencesStats } = useAdmin();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [filters, setFilters] = useState<AdminExperienceFilters>({
    search: '',
    category: '',
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

  const filteredExperiences = experiences.filter((exp) => {
    const matchesSearch = exp.name.toLowerCase().includes(filters.search.toLowerCase());
    const matchesCategory = !filters.category || exp.category.toLowerCase() === filters.category.toLowerCase();
    const matchesStatus = !filters.status || exp.status === filters.status;
    return matchesSearch && matchesCategory && matchesStatus;
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
            Experiences
          </h1>
          <p className="text-[14px] text-[#0066D2]/60 mt-1">
            Manage your platform's catalog and review new proposals
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-7">
        <StatsCard
          icon={<Layers size={22} />}
          label="Total experiences"
          value={experiencesStats.totalExperiences}
          delay={0.1}
        />
        <StatsCard
          icon={<CheckCircle2 size={22} />}
          label="Active experiences"
          value={experiencesStats.activeExperiences}
          delay={0.2}
        />
        <StatsCard
          icon={<Clock size={22} />}
          label="Pending approval"
          value={experiencesStats.pendingApproval}
          delay={0.3}
        />
        <StatsCard
          icon={<BarChart3 size={22} />}
          label="Popular category"
          value={experiencesStats.mostPopularCategory}
          delay={0.4}
        />
      </div>

      <div className="bg-[#F5F7FA] rounded-3xl p-1">
        <ExperienceFilters
          filters={filters}
          onFilterChange={setFilters}
          categoryOptions={mockCategoryOptions}
        />
        
        <ExperienceTable
          experiences={filteredExperiences}
          onEdit={() => {}}
          onDelete={() => {}}
          onView={() => {}}
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
