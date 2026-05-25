import type { TravelCategoryMetric } from '@/types/admin.types';

interface TravelCategoriesChartProps {
  data: TravelCategoryMetric[];
}

const CATEGORY_COLORS: Record<string, string> = {
  Adventure: '#1CA698',
  Cultural: '#0066D2',
  Gastronomy: '#F5A623',
  Relax: '#9B51E0',
};

export default function TravelCategoriesChart({ data }: TravelCategoriesChartProps) {
  return (
    <div className="flex flex-col gap-5 py-4">
      {data.map((item) => (
        <div key={item.name} className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-[14px] font-medium text-[#333]">{item.name}</span>
            <span className="text-[14px] font-bold text-[#1CA698]">{item.percentage}%</span>
          </div>
          <div className="h-2 w-full bg-[#f0f2f5] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${item.percentage}%`,
                backgroundColor: CATEGORY_COLORS[item.name] || '#ccc',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
