import { motion } from 'motion/react';
import type { VisitedCity } from '@/types/admin.types';

interface MostVisitedCitiesCardProps {
  cities: VisitedCity[];
}

export default function MostVisitedCitiesCard({
  cities,
}: MostVisitedCitiesCardProps) {
  return (
    <motion.div
      className="rounded-2xl border border-[#e0e0e0] bg-white p-6 shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
    >
      {/* Title */}
      <h3 className="text-[18px] font-bold text-[#0066D2] mb-1">
        Most Visited Cities
      </h3>
      <p className="text-[13px] text-[#0066D2]/60 mb-5">
        Top destinations by travelers
      </p>

      <div className="flex flex-col gap-0">
        {cities.map((city, index) => (
          <div
            key={city.rank}
            className={`flex items-center justify-between py-3 ${
              index > 0 ? 'border-t border-[#e0e0e0]/60' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-[16px] font-bold text-[#0066D2] w-5 text-center">
                {city.rank}
              </span>
              <span className="text-[14px] text-[#333]">
                {city.name},{' '}
                <span className="text-[#333]/60">{city.country}</span>
              </span>
            </div>
            <span className="text-[13px] font-semibold text-[#1CA698]">
              {city.visitors} {city.visitors === 1 ? 'user' : 'users'}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
