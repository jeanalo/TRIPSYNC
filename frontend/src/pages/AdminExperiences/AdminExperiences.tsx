import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'motion/react';
import { BarChart3, CheckCircle2, Layers, Search, MapPin, Leaf } from 'lucide-react';

import PageHeader from '@/components/PageHeader/PageHeader';

import StatsCard from '@/components/admin/StatsCard/StatsCard';
import CreateExperienceModal from '@/components/admin/CreateExperienceModal/CreateExperienceModal';
import SuccessModal from '@/components/admin/SuccessModal/SuccessModal';

import { useExperiences } from '@/hooks/useExperience';
import { CATEGORY_OPTIONS } from '@/constants/experiences';
import { apiClient } from '@/lib/apiClient';
import { realtimeService } from '@/services/realtime.service';

import type { CreateExperienceFormData } from '@/types/admin.types';

interface AdminLayoutOutletContext {
  isCreateModalRequested: boolean;
  resetCreateModalRequest: () => void;
}

const CATEGORY_FILTERS = ['All', ...CATEGORY_OPTIONS.map((c) => c.label)] as const;

export default function AdminExperiences() {
  const { experiences, loading, refetch } = useExperiences();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const outletContext = useOutletContext<AdminLayoutOutletContext>();

  useEffect(() => {
    if (outletContext?.isCreateModalRequested) {
      setIsCreateModalOpen(true);
      outletContext.resetCreateModalRequest();
    }
  }, [outletContext?.isCreateModalRequested]);

  const handleCreateSubmit = async (data: CreateExperienceFormData) => {
    const categoryLabel =
      CATEGORY_OPTIONS.find((opt) => opt.value === data.category)?.label ?? data.category;

    const toLines = (raw: string) =>
      raw.split('\n').map((s) => s.trim()).filter(Boolean);

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
    } catch (err) {
      console.error('Failed to create experience:', err);
      return;
    }

    realtimeService.sendRecommendation(data.country, {
      id: Math.random().toString(36).substring(7),
      country: data.country,
      category: categoryLabel,
      name: data.name,
      location: data.location,
      description: data.description,
      imageUrl: data.imageUrl,
    });

    refetch();
    setIsCreateModalOpen(false);
    setIsSuccessModalOpen(true);
  };

  const filteredExperiences = experiences.filter((exp) => {
    const matchesSearch = exp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || exp.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const categoryCounts: Record<string, number> = {};
  experiences.forEach((exp) => {
    categoryCounts[exp.category] = (categoryCounts[exp.category] || 0) + 1;
  });
  const topCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0];

  const uniqueCountries = new Set(experiences.map((e) => e.country));

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Experiences"
        subtitle="Browse and manage your platform's catalog"
        className="mb-7"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-7">
        <StatsCard
          icon={<Layers size={22} />}
          label="Total experiences"
          value={experiences.length}
          delay={0.1}
        />
        <StatsCard
          icon={<CheckCircle2 size={22} />}
          label="Countries covered"
          value={uniqueCountries.size}
          delay={0.2}
        />
        <StatsCard
          icon={<BarChart3 size={22} />}
          label="Top category"
          value={topCategory ? topCategory[0] : '—'}
          delay={0.3}
        />
      </div>

      <motion.div
        className="relative mb-5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
      >
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999]"
        />
        <input
          type="text"
          placeholder="Search by name, location or country..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-[#e0e0e0] bg-white pl-11 pr-4 py-2.5 text-[14px] text-[#333] outline-none transition-all duration-200 focus:border-[#0066D2] focus:ring-2 focus:ring-[#0066D2]/10"
        />
      </motion.div>

      <motion.div
        className="flex gap-2 flex-wrap mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        {CATEGORY_FILTERS.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveCategory(filter)}
            className={`px-5 py-2 rounded-full text-[14px] font-semibold transition-colors cursor-pointer border ${
              activeCategory === filter
                ? 'bg-[#0066D2] text-white border-[#0066D2]'
                : 'bg-white text-[#0066D2] border-[#0066D2]/30 hover:border-[#0066D2]'
            }`}
          >
            {filter}
          </button>
        ))}
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 rounded-full border-3 border-[#0066D2] border-t-transparent animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExperiences.map((exp, i) => (
            <motion.div
              key={exp.id}
              className="rounded-[15px] overflow-hidden bg-[#0066D2] flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.05 }}
            >
              <div className="relative h-[170px] shrink-0">
                <img
                  src={exp.image}
                  alt={exp.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex flex-col gap-3 px-4 pt-4 pb-4 flex-1">
                <p className="text-[18px] font-bold text-white leading-snug">
                  {exp.name}
                </p>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={15} className="text-white shrink-0" />
                    <span className="text-[13px] text-white">{exp.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Leaf size={15} className="text-[#F2B705] shrink-0" />
                    <span className="text-[13px] text-white">{exp.category}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-auto pt-2">
                  <span className="px-3 py-1 rounded-full bg-white/20 text-[12px] text-white font-medium">
                    {exp.country}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/20 text-[12px] text-white font-medium">
                    {exp.duration}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/20 text-[12px] text-white font-medium">
                    {exp.difficulty}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}

          {filteredExperiences.length === 0 && (
            <motion.p
              className="col-span-full text-center text-[18px] text-[#0066D2]/50 py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              No experiences found.
            </motion.p>
          )}
        </div>
      )}

      <CreateExperienceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateSubmit}
        categoryOptions={CATEGORY_OPTIONS}
      />

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
      />
    </div>
  );
}
