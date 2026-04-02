import { useTravel } from '../../context/TravelContext';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Plane,
  Moon,
  CalendarDays,
  Share2,
  Map,
  PieChart,
} from 'lucide-react';

import PageHeader from '../../components/ui/PageHeader';
import DetailCard from '../../components/ui/DetailCard';
import CardHeader from '../../components/ui/CardHeader';

const Dashboard = () => {
  const { user, tripDetails, expenses, activities } = useTravel();

  const totalSpent = expenses.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const remainingBudget = (Number(tripDetails.budget) || 0) - totalSpent;

  // Quick-access cards data
  const actionCards = [
    {
      to: '/app/setup',
      icon: Plane,
      title: 'Trip Setup',
      subtitle: tripDetails.destinationCountry
        ? `Trip to ${tripDetails.destinationCountry}`
        : 'No trip scheduled',
    },
    {
      to: '/app/jet-lag',
      icon: Moon,
      title: 'Jet Lag Assistant',
      subtitle: 'Adjust your schedule',
    },
    {
      to: '/app/experiences',
      icon: Map,
      title: 'Experiences',
      subtitle: 'Explore activities',
    },
  ];

  return (
    <div>
      {/* Header row */}
      <PageHeader
        title={`Welcome back, ${user?.name || 'Pepito'}`}
        subtitle={
          <>
            Here's what's happening with your trip to{' '}
            {tripDetails.destinationCountry || 'your next destination'}.
          </>
        }
        action={
          <motion.button
            className="flex items-center gap-2 rounded-[15px] border-none bg-[#0066D2] px-6 py-3 text-[16px] font-semibold text-white cursor-pointer transition-all duration-300 hover:bg-[#0055b0] hover:shadow-lg"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Share2 size={20} />
            Share Trip
          </motion.button>
        }
      />

      {/* Content area */}
      <div className="flex flex-col gap-[30px] px-12">
        {/* Top row */}
        <div className="grid grid-cols-3 gap-[30px]">
          {actionCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.to}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * i }}
              >
                <Link to={card.to} className="block no-underline">
                  <div className="flex h-[180px] flex-col justify-between rounded-[15px] bg-[#1CA698] p-[30px] transition-all duration-300 hover:shadow-lg hover:brightness-110">
                    {/* Icon */}
                    <div className="flex h-[50px] w-[50px] items-center justify-center rounded-[12px] bg-white/20">
                      <Icon size={24} className="text-white" />
                    </div>
                    {/* Text */}
                    <div>
                      <h3 className="text-[22px] font-bold leading-[28px] text-white">
                        {card.title}
                      </h3>
                      <p className="mt-1 text-[14px] leading-[20px] text-white/80">
                        {card.subtitle}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-2 gap-[30px]">
          {/* Schedule Card */}
          <DetailCard delay={0.4}>
            <div className="flex flex-col gap-6">
            <CardHeader
              icon={<CalendarDays size={24} />}
              title="Schedule"
              subtitle="Here is your itinerary."
            />

            {/* Activity rows */}
            <div className="flex flex-col">
              {(activities.length > 0
                ? activities.slice(0, 4)
                : [
                    { id: '1', name: 'Activity one', location: 'Location' },
                    { id: '2', name: 'Activity two', location: 'Location' },
                    { id: '3', name: 'Activity three', location: 'Location' },
                    { id: '4', name: 'Activity four', location: 'Location' },
                  ]
              ).map((act, index) => (
                <div
                  key={act.id}
                  className={`flex items-center justify-between py-4 ${
                    index > 0 ? 'border-t border-[#0066D2]/15' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[18px] font-bold text-[#0066D2]">
                      {index + 1}
                    </span>
                    <span className="text-[16px] text-[#0066D2]">
                      {act.name}
                    </span>
                  </div>
                  <span className="text-[16px] font-semibold text-[#0066D2]">
                    {act.location}
                  </span>
                </div>
              ))}
            </div>
            </div>
          </DetailCard>

          {/* Budget Card */}
          <DetailCard delay={0.5}>
            <div className="flex flex-col gap-6">
            <CardHeader
              icon={<PieChart size={24} />}
              title="Budget"
              subtitle="Manage your expenses"
            />

            {/* Budget rows */}
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <span className="text-[16px] text-[#0066D2]">Total budget</span>
                <span className="text-[20px] font-bold text-[#0066D2]">
                  ${(Number(tripDetails.budget) || 3500).toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[16px] text-[#0066D2]">Spent so far</span>
                <span className="text-[20px] font-bold text-[#E53935]">
                  -${totalSpent > 0 ? totalSpent.toLocaleString() : '1.200'}
                </span>
              </div>

              {/* Divider */}
              <div className="h-[1px] bg-[#0066D2]/20" />

              <div className="flex items-center justify-between">
                <span className="text-[18px] font-bold text-[#0066D2]">
                  Remaining
                </span>
                <span className="text-[22px] font-bold text-[#0066D2]">
                  ${remainingBudget > 0 ? remainingBudget.toLocaleString() : '2.300'}
                </span>
              </div>
            </div>
            </div>
          </DetailCard>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
