import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import type { TopDestination } from '@/types/admin.types';

interface TopDestinationsChartProps {
  data: TopDestination[];
}

const COLORS = ['#1CA698', '#0066D2', '#F5A623', '#9B51E0', '#EB5757'];

export default function TopDestinationsChart({ data }: TopDestinationsChartProps) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="bookings"
            nameKey="city"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: '12px',
              border: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            iconType="circle"
            formatter={(value) => <span className="text-[12px] text-[#666]">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
