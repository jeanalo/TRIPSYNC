import { motion } from 'motion/react';
import { TrendingUp, Globe, Users, DollarSign } from 'lucide-react';

import StatsCard from '@/components/admin/StatsCard/StatsCard';
import MonthlyBookingsChart from '@/components/admin/AnalyticsCharts/MonthlyBookingsChart';
import TopDestinationsChart from '@/components/admin/AnalyticsCharts/TopDestinationsChart';
import TravelCategoriesChart from '@/components/admin/AnalyticsCharts/TravelCategoriesChart';
import RecentActivityTable from '@/components/admin/AnalyticsTable/RecentActivityTable';

import {
  mockAnalyticsStats,
  mockMonthlyBookings,
  mockTopDestinations,
  mockTravelCategories,
  mockRecentActivity,
} from '@/services/admin.analytics.mock';

export default function AdminAnalytics() {
  return (
    <div className="flex flex-col">
      
      <motion.div
        className="mb-7"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-[26px] font-bold text-[#0066D2] leading-tight">
          Analytics
        </h1>
        <p className="text-[14px] text-[#0066D2]/60 mt-1">
          Track traveler behavior and platform performance insights
        </p>
      </motion.div>

      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-7">
        <StatsCard
          icon={<TrendingUp size={22} />}
          label="Total bookings"
          value={mockAnalyticsStats.totalBookings}
          delay={0.1}
        />
        <StatsCard
          icon={<Globe size={22} />}
          label="Most visited country"
          value={mockAnalyticsStats.mostVisitedCountry}
          delay={0.2}
        />
        <StatsCard
          icon={<Users size={22} />}
          label="Active travelers"
          value={mockAnalyticsStats.activeTravelers}
          delay={0.3}
        />
        <StatsCard
          icon={<DollarSign size={22} />}
          label="Revenue this month"
          value={`$${mockAnalyticsStats.revenueThisMonth.toLocaleString()}`}
          delay={0.4}
        />
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-7">
        
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-[#e0e0e0] shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[18px] font-bold text-[#333]">Monthly Bookings</h3>
            <span className="text-[12px] text-[#1CA698] font-medium bg-[#1CA698]/5 px-3 py-1 rounded-full">
              +12% vs last year
            </span>
          </div>
          <MonthlyBookingsChart data={mockMonthlyBookings} />
        </div>

        
        <div className="bg-white rounded-3xl p-6 border border-[#e0e0e0] shadow-sm">
          <h3 className="text-[18px] font-bold text-[#333] mb-6">Top Destinations</h3>
          <TopDestinationsChart data={mockTopDestinations} />
        </div>

        
        <div className="bg-white rounded-3xl p-6 border border-[#e0e0e0] shadow-sm">
          <h3 className="text-[18px] font-bold text-[#333] mb-4">Travel Categories</h3>
          <p className="text-[13px] text-[#999] mb-6">Distribution of bookings by category</p>
          <TravelCategoriesChart data={mockTravelCategories} />
        </div>

        
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-[18px] font-bold text-[#333]">Recent traveler activity</h3>
          </div>
          <RecentActivityTable activities={mockRecentActivity} />
        </div>
      </div>
    </div>
  );
}
