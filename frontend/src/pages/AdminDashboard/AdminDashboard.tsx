import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Plane, MapPin, User, Mail, Calendar, Globe, Plus } from 'lucide-react';

import PageHeader from '@/components/PageHeader/PageHeader';
import ActionButton from '@/components/ActionButton/ActionButton';
import SummaryCard from '@/components/SummaryCard/SummaryCard';
import SearchTripsCard from '@/components/admin/SearchTripsCard/SearchTripsCard';
import MostVisitedCountriesCard from '@/components/admin/MostVisitedCitiesCard/MostVisitedCitiesCard';
import CreateExperienceModal from '@/components/admin/CreateExperienceModal/CreateExperienceModal';
import SuccessModal from '@/components/admin/SuccessModal/SuccessModal';

import { useAdmin } from '@/context/AdminProvider';
import { useAuth } from '@/context/AuthProvider';
import { CATEGORY_OPTIONS } from '@/constants/experiences';

import type { CreateExperienceFormData, SearchTripsFilters, TripResult } from '@/types/admin.types';

export default function AdminDashboard() {
  const { tripsStats, dashboardStats, createExperience, searchTripsByCountry } = useAdmin();
  const { user } = useAuth();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<TripResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchedCountry, setSearchedCountry] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleCreateSubmit = async (data: CreateExperienceFormData) => {
    setIsCreating(true);
    setCreateError(null);
    try {
      await createExperience(data);
      setIsCreateModalOpen(false);
      setIsSuccessModalOpen(true);
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Failed to create experience');
    } finally {
      setIsCreating(false);
    }
  };

  const handleSearch = async (filters: SearchTripsFilters) => {
    if (!filters.country) return;
    setSearchLoading(true);
    setSearchedCountry(filters.country);
    setHasSearched(true);
    try {
      const results = await searchTripsByCountry(filters.country);
      setSearchResults(results);
    } catch {
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        title={`Welcome back, ${user?.name || 'Admin'}`}
        subtitle="Here's what's happening with your admin dashboard"
        action={
          <ActionButton
            icon={<Plus size={18} />}
            onClick={() => setIsCreateModalOpen(true)}
          >
            Create Experience
          </ActionButton>
        }
      />

      <div className="flex flex-col gap-[30px] px-4 lg:px-12 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[30px]">
          <SummaryCard
            icon={<Users size={22} />}
            title="Active Users"
            subtitle={dashboardStats.activeUsers}
            delay={0.1}
          />
          <SummaryCard
            icon={<Plane size={22} />}
            title="Active Trips"
            subtitle={dashboardStats.activeTrips}
            delay={0.2}
          />
          <SummaryCard
            icon={<MapPin size={22} />}
            title="Top Destination"
            subtitle={tripsStats.topDestination}
            delay={0.3}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[30px]">
          <SearchTripsCard onSearch={handleSearch} loading={searchLoading} />
          <MostVisitedCountriesCard countries={dashboardStats.topCountries} />
        </div>

        <AnimatePresence>
          {hasSearched && (
            <motion.div
              className="mt-7"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              <div className="rounded-[15px] border-2 border-[#0066D2] bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-5">
                  <Globe size={20} className="text-[#0066D2]" />
                  <h3 className="text-[18px] font-bold text-[#0066D2]">
                    Users Traveling To {searchedCountry}
                  </h3>
                  <span className="ml-auto text-[13px] text-[#0066D2]/60 bg-[#f0f6ff] px-3 py-1 rounded-full">
                    {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {searchResults.length === 0 ? (
                  <div className="text-center py-10">
                    <MapPin size={40} className="mx-auto text-[#0066D2]/30 mb-3" />
                    <p className="text-[15px] text-[#0066D2]/60">
                      No active trips found for <strong>{searchedCountry}</strong>
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {searchResults.map((result, index) => (
                      <motion.div
                        key={result.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 p-4 rounded-xl border border-[#0066D2]/15 bg-[#f0f6ff]/50 hover:border-[#0066D2]/30 hover:bg-[#f0f6ff] transition-all duration-200"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="w-10 h-10 rounded-full bg-[#0066D2]/10 flex items-center justify-center flex-shrink-0">
                            <User size={18} className="text-[#0066D2]" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[14px] font-semibold text-[#0066D2] truncate">
                              {result.user_name}
                            </p>
                            <div className="flex items-center gap-1 text-[12px] text-[#0066D2]/60">
                              <Mail size={11} />
                              <span className="truncate">{result.user_email}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-[13px] text-[#0066D2] flex-shrink-0">
                          <div className="flex items-center gap-1">
                            <Plane size={13} className="text-[#1CA698]" />
                            <span>{result.departure_country || '—'}</span>
                            <span className="text-[#0066D2]/30 mx-1">→</span>
                            <span className="font-medium text-[#0066D2]">
                              {result.destination_country}
                            </span>
                          </div>
                          {result.departure_date && (
                            <div className="flex items-center gap-1 text-[12px] text-[#0066D2]/60">
                              <Calendar size={12} />
                              <span>{result.departure_date}</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <CreateExperienceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateSubmit}
        categoryOptions={CATEGORY_OPTIONS}
        isSubmitting={isCreating}
        submitError={createError}
      />

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
      />
    </>
  );
}
