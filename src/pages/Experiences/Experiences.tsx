import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Bookmark, BookmarkCheck, Leaf } from 'lucide-react';
import { motion } from 'motion/react';
import PageHeader from '../../components/PageHeader/PageHeader';
import { useExperiences } from '@/hooks/useExperience';
import { useTravel } from '../../context/TravelContext';

const FILTERS = ['All', 'Chill', 'Adventure', 'Cultural', 'Free Tour', 'Saved'] as const;
type Filter = (typeof FILTERS)[number];

const Experiences = () => {
  const navigate = useNavigate();
  const { experiences, loading } = useExperiences();
  const { tripDetails } = useTravel();
  const [activeFilter, setActiveFilter] = useState<Filter>('All');
  const [saved, setSaved] = useState<Set<number>>(new Set([1]));

  const availableExperiences = tripDetails?.destinationCountry
    ? experiences.filter(
        (exp) =>
          exp.country.toLowerCase() === tripDetails.destinationCountry.toLowerCase()
      )
    : experiences;

  const visible = availableExperiences.filter((exp) => {
    if (activeFilter === 'Saved') return saved.has(exp.id);
    if (activeFilter === 'All') return true;
    return exp.category === activeFilter;
  });

  const toggleSave = (id: number) => {
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (loading) {
    return <p className="p-10">Loading...</p>;
  }

  return (
    <div>
      <PageHeader
        title="Discover Experiences"
        subtitle="Find the best local activities and hidden gems."
      />

      <div className="flex flex-col gap-6 px-4 lg:px-12 pb-12">
        <motion.div
          className="flex gap-2 flex-wrap"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2 rounded-full text-[14px] font-semibold transition-colors cursor-pointer border ${
                activeFilter === filter
                  ? 'bg-[#0066D2] text-white border-[#0066D2]'
                  : 'bg-white text-[#0066D2] border-[#0066D2]/30 hover:border-[#0066D2]'
              }`}
            >
              {filter}
            </button>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.map((exp, i) => (
            <motion.div
              key={exp.id}
              className="rounded-[15px] overflow-hidden bg-[#0066D2] flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.07 }}
            >
              <div className="relative h-[170px] shrink-0">
                <img
                  src={exp.image}
                  alt={exp.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => toggleSave(exp.id)}
                  className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-white transition-colors cursor-pointer border-none"
                >
                  {saved.has(exp.id) ? (
                    <BookmarkCheck size={16} className="text-[#0066D2]" />
                  ) : (
                    <Bookmark size={16} className="text-[#0066D2]" />
                  )}
                </button>
              </div>

              <div className="flex flex-col gap-3 px-4 pt-4 pb-4 flex-1">
                <p className="text-[18px] font-bold text-white leading-snug">
                  {exp.name}
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={15} className="text-white shrink-0" />
                    <span className="text-[13px] text-white">{exp.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Leaf size={15} className="text-[#F2B705] shrink-0" />
                    <span className="text-[13px] text-white">{exp.category}</span>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/app/experiences/${exp.id}`)}
                  className="mt-auto w-full bg-[#F2B705] text-black font-semibold text-[15px] py-2.5 rounded-[10px] hover:bg-[#e0a800] transition-colors cursor-pointer border-none"
                >
                  View More
                </button>
              </div>
            </motion.div>
          ))}

          {visible.length === 0 && (
            <motion.p
              className="col-span-full text-center text-[18px] text-[#0066D2]/50 py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              No experiences found.
            </motion.p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Experiences;
