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
import { supabase } from '@/lib/supabase';
import { apiClient } from '@/lib/apiClient';
import { CATEGORY_OPTIONS } from '@/constants/experiences';

import type { CreateExperienceFormData, SearchTripsFilters } from '@/types/admin.types';

interface TripResult {
  id: string;
  user_id: string;
  destination_country: string;
  departure_country: string;
  departure_date: string;
  arrival_date: string;
  user_email: string;
  user_name: string;
}

export default function AdminDashboard() {
  const { tripsStats, dashboardStats } = useAdmin();
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
    const categoryLabel =
      CATEGORY_OPTIONS.find((opt) => opt.value === data.category)?.label ?? data.category;
    const toLines = (raw: string) =>
      raw.split('\n').map((s) => s.trim()).filter(Boolean);

    setIsCreating(true);
    setCreateError(null);
    try {
      await apiClient.post('/api/experiences', {
        name: data.name,
        country: data.country,
        location: data.location,
        category: categoryLabel,
        image: data.imageUrl ?? '',
        description: data.description,
        duration: data.duration,
        difficulty: data.difficulty,
        eco: data.eco ?? '',
        highlights: toLines(data.highlights ?? '').map((text) => ({ icon: 'Star', text })),
        included: toLines(data.included ?? ''),
        tips: toLines(data.tips ?? ''),
      });
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
      const { data: trips, error } = await supabase
        .from('trips')
        .select('*')
        .ilike('destination_country', filters.country);

      if (error) {
        console.error('Error fetching trips:', error);
        setSearchResults([]);
        return;
      }

      if (!trips || trips.length === 0) {
        setSearchResults([]);
        return;
      }

      const userIds = [...new Set(trips.map((t: { user_id: string }) => t.user_id))];

      const { data: authData } = await supabase.auth.admin.listUsers();

      const usersMap = new Map<string, { email: string; name: string }>();
      if (authData?.users) {
        for (const u of authData.users) {
          usersMap.set(u.id, {
            email: u.email ?? '',
            name: u.user_metadata?.name ?? u.email ?? '',
          });
        }
      }

      const results: TripResult[] = trips.map(
        (t: {
          id: string;
          user_id: string;
          destination_country: string;
          departure_country: string;
          departure_date: string;
          arrival_date: string;
        }) => {
          const userData = usersMap.get(t.user_id);
          return {
            id: t.id,
            user_id: t.user_id,
            destination_country: t.destination_country ?? '',
            departure_country: t.departure_country ?? '',
            departure_date: t.departure_date ?? '',
            arrival_date: t.arrival_date ?? '',
            user_email: userData?.email ?? t.user_id,
            user_name: userData?.name ?? 'Unknown User',
          };
        }
      );

      setSearchResults(results);
    } catch (err) {
      console.error('Search error:', err);
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
          title="Active users"
          subtitle={dashboardStats.activeUsers}
          delay={0.1}
        />
        <SummaryCard
          icon={<Plane size={22} />}
          title="Active trips"
          subtitle={dashboardStats.activeTrips}
          delay={0.2}
        />
        <SummaryCard
          icon={<MapPin size={22} />}
          title="Top destination"
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
            <div className="rounded-2xl border border-[#e0e0e0] bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <Globe size={20} className="text-[#0066D2]" />
                <h3 className="text-[18px] font-bold text-[#0066D2]">
                  Users traveling to {searchedCountry}
                </h3>
                <span className="ml-auto text-[13px] text-[#999] bg-[#f5f5f5] px-3 py-1 rounded-full">
                  {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                </span>
              </div>

              {searchResults.length === 0 ? (
                <div className="text-center py-10">
                  <MapPin size={40} className="mx-auto text-[#ccc] mb-3" />
                  <p className="text-[15px] text-[#999]">
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
                      className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 p-4 rounded-xl border border-[#eee] bg-[#fafbfc] hover:border-[#0066D2]/20 hover:bg-[#f0f6ff] transition-all duration-200"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-10 h-10 rounded-full bg-[#0066D2]/10 flex items-center justify-center flex-shrink-0">
                          <User size={18} className="text-[#0066D2]" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[14px] font-semibold text-[#333] truncate">
                            {result.user_name}
                          </p>
                          <div className="flex items-center gap-1 text-[12px] text-[#888]">
                            <Mail size={11} />
                            <span className="truncate">{result.user_email}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-[13px] text-[#666] flex-shrink-0">
                        <div className="flex items-center gap-1">
                          <Plane size={13} className="text-[#1CA698]" />
                          <span>{result.departure_country || '—'}</span>
                          <span className="text-[#ccc] mx-1">→</span>
                          <span className="font-medium text-[#0066D2]">
                            {result.destination_country}
                          </span>
                        </div>
                        {result.departure_date && (
                          <div className="flex items-center gap-1 text-[12px] text-[#999]">
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
