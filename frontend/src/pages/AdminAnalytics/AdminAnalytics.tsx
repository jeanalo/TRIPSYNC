import { useMemo } from 'react';
import { MapPin, Users, Briefcase, TrendingUp } from 'lucide-react';

import PageHeader from '@/components/PageHeader/PageHeader';
import StatsCard from '@/components/admin/StatsCard/StatsCard';
import MonthlyBookingsChart from '@/components/admin/AnalyticsCharts/MonthlyBookingsChart';
import { useAdmin } from '@/context/AdminProvider';
import type { AdminTrip } from '@/types/admin.types';

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const STATUS_STYLES: Record<AdminTrip['status'], string> = {
  active: 'bg-[#ebf5ff] text-[#0066D2] border-[#0066D2]/10',
  upcoming: 'bg-[#fff9e6] text-[#d4a017] border-[#d4a017]/10',
  completed: 'bg-[#eafaf1] text-[#27ae60] border-[#27ae60]/10',
  cancelled: 'bg-[#fdf3f3] text-[#e74c3c] border-[#e74c3c]/10',
};

function TripStatusBadge({ status }: { status: AdminTrip['status'] }) {
  return (
    <span className={`px-2.5 py-1 rounded-full text-[12px] font-medium border ${STATUS_STYLES[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export default function AdminAnalytics() {
  const { trips, tripsStats, usersStats, dashboardStats } = useAdmin();

  const avgBudget = useMemo(() => {
    const withBudget = trips.filter((t) => t.budget > 0);
    if (!withBudget.length) return 0;
    return Math.round(withBudget.reduce((sum, t) => sum + t.budget, 0) / withBudget.length);
  }, [trips]);

  const monthlyData = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const trip of trips) {
      if (!trip.startDate) continue;
      const month = MONTH_NAMES[new Date(trip.startDate).getMonth()];
      counts[month] = (counts[month] || 0) + 1;
    }
    return MONTH_NAMES.filter((m) => counts[m]).map((month) => ({ month, bookings: counts[month] }));
  }, [trips]);

  const recentTrips = useMemo(
    () => [...trips].sort((a, b) => b.startDate.localeCompare(a.startDate)).slice(0, 6),
    [trips]
  );

  const maxVisitors = dashboardStats.topCountries[0]?.visitors || 1;

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Analytics"
        subtitle="Platform activity and traveler insights"
      />

      <div className="px-4 lg:px-12 flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatsCard icon={<Briefcase size={22} />} label="Total trips" value={tripsStats.totalTrips} delay={0.1} />
          <StatsCard icon={<Users size={22} />} label="Total users" value={usersStats.totalUsers} delay={0.2} />
          <StatsCard icon={<MapPin size={22} />} label="Top destination" value={tripsStats.topDestination || '—'} delay={0.3} />
          <StatsCard icon={<TrendingUp size={22} />} label="Avg trip budget" value={avgBudget ? `$${avgBudget.toLocaleString()}` : '—'} delay={0.4} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 border-2 border-[#0066D2] shadow-sm">
            <h3 className="text-[18px] font-bold text-[#333] mb-6">Trips by month</h3>
            {monthlyData.length > 0 ? (
              <MonthlyBookingsChart data={monthlyData} />
            ) : (
              <div className="h-[300px] flex items-center justify-center text-[#999] text-[14px]">No trip data yet</div>
            )}
          </div>

          <div className="bg-white rounded-3xl p-6 border-2 border-[#0066D2] shadow-sm">
            <h3 className="text-[18px] font-bold text-[#333] mb-6">Top destinations</h3>
            {dashboardStats.topCountries.length > 0 ? (
              <div className="flex flex-col gap-4">
                {dashboardStats.topCountries.map((c) => (
                  <div key={c.country} className="flex items-center gap-3">
                    <span className="text-[13px] font-bold text-[#1CA698] w-4 shrink-0">{c.rank}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between mb-1.5">
                        <span className="text-[13px] font-medium text-[#333] truncate">{c.country}</span>
                        <span className="text-[12px] text-[#999] ml-2 shrink-0">{c.visitors} trip{c.visitors !== 1 ? 's' : ''}</span>
                      </div>
                      <div className="h-1.5 bg-[#f0f0f0] rounded-full overflow-hidden">
                        <div className="h-full bg-[#1CA698] rounded-full transition-all duration-500" style={{ width: `${(c.visitors / maxVisitors) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[14px] text-[#999]">No data yet</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-3xl border-2 border-[#0066D2] shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b-2 border-[#0066D2]">
            <h3 className="text-[18px] font-bold text-[#333]">Recent trips</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#f5f7fa]">
                  <th className="px-6 py-3 text-[12px] font-bold text-[#0066D2] tracking-wider">Traveler</th>
                  <th className="px-6 py-3 text-[12px] font-bold text-[#0066D2] tracking-wider">Destination</th>
                  <th className="px-6 py-3 text-[12px] font-bold text-[#0066D2] tracking-wider">Dates</th>
                  <th className="px-6 py-3 text-[12px] font-bold text-[#0066D2] tracking-wider">Budget</th>
                  <th className="px-6 py-3 text-[12px] font-bold text-[#0066D2] tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0066D2]/10">
                {recentTrips.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-[14px] text-[#999]">No trips yet</td>
                  </tr>
                ) : (
                  recentTrips.map((trip) => (
                    <tr key={trip.id} className="hover:bg-[#f0f6ff] transition-colors">
                      <td className="px-6 py-4 text-[14px] font-semibold text-[#333]">{trip.travelerName}</td>
                      <td className="px-6 py-4 text-[14px] text-[#666]">{trip.destinationCountry}</td>
                      <td className="px-6 py-4 text-[13px] text-[#666]">{trip.startDate} → {trip.endDate}</td>
                      <td className="px-6 py-4 text-[14px] font-bold text-[#333]">{trip.budget > 0 ? `$${trip.budget.toLocaleString()}` : '—'}</td>
                      <td className="px-6 py-4"><TripStatusBadge status={trip.status} /></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}