import DetailCard from '@/components/DetailCard/DetailCard';
import type { VisitedCountry } from '@/types/admin.types';

interface MostVisitedCitiesCardProps {
  countries: VisitedCountry[];
}

export default function MostVisitedCitiesCard({
  countries,
}: MostVisitedCitiesCardProps) {
  return (
    <DetailCard delay={0.5}>
      <h3 className="text-[18px] font-bold text-[#0066D2] mb-1">
        Most Visited Countries
      </h3>
      <p className="text-[13px] text-[#0066D2]/60 mb-5">
        Top destinations by travelers
      </p>

      <div className="flex flex-col gap-0">
        {countries.map((item, index) => (
          <div
            key={item.rank}
            className={`flex items-center justify-between py-3 ${
              index > 0 ? 'border-t border-[#e0e0e0]/60' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-[16px] font-bold text-[#0066D2] w-5 text-center">
                {item.rank}
              </span>
              <span className="text-[14px] text-[#333]">{item.country}</span>
            </div>
            <span className="text-[13px] font-semibold text-[#1CA698]">
              {item.visitors} {item.visitors === 1 ? 'user' : 'users'}
            </span>
          </div>
        ))}
      </div>
    </DetailCard>
  );
}
