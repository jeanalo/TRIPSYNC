import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'motion/react';

import PageHeader from '@/components/PageHeader/PageHeader';

import TripsFilters from '@/components/admin/TripsFilters/TripsFilters';
import TripsTable from '@/components/admin/TripsTable/TripsTable';
import CreateExperienceModal from '@/components/admin/CreateExperienceModal/CreateExperienceModal';
import SuccessModal from '@/components/admin/SuccessModal/SuccessModal';

import { useAdmin } from '@/context/AdminProvider';
import { mockCountryOptions, mockCategoryOptions } from '@/services/admin.mock';

import type { AdminTripFilters, CreateExperienceFormData } from '@/types/admin.types';

interface AdminLayoutOutletContext {
  isCreateModalRequested: boolean;
  resetCreateModalRequest: () => void;
}

export default function AdminTrips() {
  const { trips, tripsStats } = useAdmin();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [filters, setFilters] = useState<AdminTripFilters>({
    search: '',
    country: '',
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
    setIsCreateModalOpen(false);
    setIsSuccessModalOpen(true);
  };

  const filteredTrips = trips.filter((trip) => {
    const matchesSearch =
      trip.travelerName.toLowerCase().includes(filters.search.toLowerCase()) ||
      trip.id.toLowerCase().includes(filters.search.toLowerCase());

    const matchesCountry =
      !filters.country ||
      trip.destinationCountry.toLowerCase() === filters.country.toLowerCase();

    const matchesDate =
      !filters.date || trip.startDate >= filters.date || trip.endDate >= filters.date;

    return matchesSearch && matchesCountry && matchesDate;
  });

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Trips"
        subtitle="Monitor active trips and traveler itineraries"
        className="mb-7"
      />

      <div className="bg-[#F5F7FA] rounded-3xl p-1">
        <TripsFilters
          filters={filters}
          onFilterChange={setFilters}
          countryOptions={mockCountryOptions}
        />

        <TripsTable trips={filteredTrips} />
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
