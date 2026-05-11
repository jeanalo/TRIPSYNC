import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { MonthlyBooking } from '@/types/admin.types';

interface MonthlyBookingsChartProps {
  data: MonthlyBooking[];
}

export default function MonthlyBookingsChart({ data }: MonthlyBookingsChartProps) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#999', fontSize: 12 }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#999', fontSize: 12 }}
          />
          <Tooltip
            cursor={{ fill: '#f5f7fa' }}
            contentStyle={{
              borderRadius: '12px',
              border: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          />
          <Bar
            dataKey="bookings"
            radius={[4, 4, 0, 0]}
            barSize={24}
          >
            {data.map((_, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={index === 6 ? '#1CA698' : '#0066D2'} 
                fillOpacity={index === 6 ? 1 : 0.6}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
