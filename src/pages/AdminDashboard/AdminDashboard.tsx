import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'motion/react';
import { Users, Plane, MapPin, Plus } from 'lucide-react';

import StatsCard from '@/components/admin/StatsCard/StatsCard';
import SearchTripsCard from '@/components/admin/SearchTripsCard/SearchTripsCard';
import MostVisitedCitiesCard from '@/components/admin/MostVisitedCitiesCard/MostVisitedCitiesCard';
import CreateExperienceModal from '@/components/admin/CreateExperienceModal/CreateExperienceModal';
import SuccessModal from '@/components/admin/SuccessModal/SuccessModal';

import {
  mockAdminStats,
  mockVisitedCities,
  mockCountryOptions,
  mockCityOptions,
  mockCategoryOptions,
  mockAdminUser,
} from '@/services/admin.mock';

import type { CreateExperienceFormData, SearchTripsFilters } from '@/types/admin.types';

interface AdminLayoutOutletContext {
  isCreateModalRequested: boolean;
  resetCreateModalRequest: () => void;
}

export default function AdminDashboard() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

 
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

  const handleSearch = (filters: SearchTripsFilters) => {
  
    console.log('Search filters:', filters);
  };

  return (
    <>
     
      <motion.div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-7"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-[26px] font-bold text-[#0066D2] leading-tight">
            Welcome back, {mockAdminUser.name}
          </h1>
          <p className="text-[14px] text-[#0066D2]/60 mt-1">
            Here's what's happening with your admin dashboard
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-[#1CA698] px-5 py-2.5 text-[14px] font-semibold text-white border-none cursor-pointer transition-all duration-200 hover:bg-[#178f83] hover:shadow-lg shrink-0"
        >
          <Plus size={18} strokeWidth={2.5} />
          Create Experience
        </button>
      </motion.div>

      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-7">
        <StatsCard
          icon={<Users size={22} />}
          label="Active users"
          value={mockAdminStats.activeUsers}
          delay={0.1}
        />
        <StatsCard
          icon={<Plane size={22} />}
          label="Active trips"
          value={mockAdminStats.activeTrips}
          delay={0.2}
        />
        <StatsCard
          icon={<MapPin size={22} />}
          label="Top destination"
          value={mockAdminStats.topDestination}
          delay={0.3}
        />
      </div>

     
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <SearchTripsCard
          countryOptions={mockCountryOptions}
          cityOptions={mockCityOptions}
          onSearch={handleSearch}
        />
        <MostVisitedCitiesCard cities={mockVisitedCities} />
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
    </>
  );
}
