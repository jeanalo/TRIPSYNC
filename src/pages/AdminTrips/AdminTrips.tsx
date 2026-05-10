import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'motion/react';
import { Plane, CheckCircle2, History, MapPin } from 'lucide-react';

import StatsCard from '@/components/admin/StatsCard/StatsCard';
import TripsFilters from '@/components/admin/TripsFilters/TripsFilters';
import TripsTable from '@/components/admin/TripsTable/TripsTable';
import CreateExperienceModal from '@/components/admin/CreateExperienceModal/CreateExperienceModal';
import SuccessModal from '@/components/admin/SuccessModal/SuccessModal';

import {
  mockAdminTrips,
  mockAdminTripsStats,
  mockCountryOptions,
  mockCityOptions,
  mockCategoryOptions,
} from '@/services/admin.mock';

import type {
  AdminTripFilters,
  CreateExperienceFormData,
} from '@/types/admin.types';

interface AdminLayoutOutletContext {
  isCreateModalRequested: boolean;
  resetCreateModalRequest: () => void;
}

export default function AdminTrips() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [filters, setFilters] = useState<AdminTripFilters>({
    search: '',
    country: '',
    status: '',
    date: '',
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

  const filteredTrips = mockAdminTrips.filter((trip) => {
    const matchesSearch = 
      trip.travelerName.toLowerCase().includes(filters.search.toLowerCase()) ||
      trip.id.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesCountry = !filters.country || 
      trip.destinationCountry.toLowerCase() === filters.country.toLowerCase();
    
    const matchesStatus = !filters.status || trip.status === filters.status;
    
    const matchesDate = !filters.date || 
      trip.startDate >= filters.date || trip.endDate >= filters.date;

    return matchesSearch && matchesCountry && matchesStatus && matchesDate;
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
            Trips
          </h1>
          <p className="text-[14px] text-[#0066D2]/60 mt-1">
            Monitor active trips and traveler itineraries
          </p>
        </div>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-7">
        <StatsCard
          icon={<Plane size={22} />}
          label="Total trips"
          value={mockAdminTripsStats.totalTrips}
          delay={0.1}
        />
        <StatsCard
          icon={<CheckCircle2 size={22} />}
          label="Active trips"
          value={mockAdminTripsStats.activeTrips}
          delay={0.2}
        />
        <StatsCard
          icon={<History size={22} />}
          label="Completed trips"
          value={mockAdminTripsStats.completedTrips}
          delay={0.3}
        />
        <StatsCard
          icon={<MapPin size={22} />}
          label="Top destination"
          value={mockAdminTripsStats.topDestination}
          delay={0.4}
        />
      </div>

      
      <div className="bg-[#F5F7FA] rounded-3xl p-1">
        <TripsFilters
          filters={filters}
          onFilterChange={setFilters}
          countryOptions={mockCountryOptions}
        />
        
        <TripsTable
          trips={filteredTrips}
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
