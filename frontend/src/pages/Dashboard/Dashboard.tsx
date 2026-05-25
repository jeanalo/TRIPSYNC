import { useState } from 'react';
import { useTrip } from '../../context/TripProvider';
import { useExpenseActivity } from '../../context/ExpenseActivityProvider';
import { useAuth } from '../../context/AuthProvider';
import { Plane, Moon, CalendarDays, Share2, Map, PieChart, AlertCircle } from 'lucide-react';
import { apiClient } from '../../lib/apiClient';

import PageHeader from '../../components/PageHeader/PageHeader';
import ActionButton from '../../components/ActionButton/ActionButton';
import DetailCard from '../../components/DetailCard/DetailCard';
import CardHeader from '../../components/CardHeader/CardHeader';
import SummaryCard from '../../components/SummaryCard/SummaryCard';
import ShareTripModal from '../../components/ShareTripModal/ShareTripModal';
import AlertModal from '../../components/AlertModal/AlertModal';

const Dashboard = () => {
  const { user } = useAuth();
  const { tripDetails, tripId } = useTrip();
  const { expenses, activities } = useExpenseActivity();

  const [modalOpen, setModalOpen] = useState(false);
  const [inviteUrl, setInviteUrl] = useState('');
  const [sharing, setSharing] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');

  const handleShareTrip = async () => {
    if (!tripId) {
      setAlertMsg('Set up your trip first before sharing it.');
      return;
    }
    setSharing(true);
    try {
      const { token } = await apiClient.post<{ token: string }>(
        `/api/trips/${tripId}/invite`,
        {}
      );
      setInviteUrl(`https://tripsync-xoxn.vercel.app/join-trip?token=${token}`);
      setModalOpen(true);
    } catch (err) {
      setAlertMsg(err instanceof Error ? err.message : 'Could not generate invite link.');
    } finally {
      setSharing(false);
    }
  };

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
          <ActionButton icon={<Share2 size={20} />} onClick={handleShareTrip} disabled={sharing}>
            {sharing ? 'Generating...' : 'Share Trip'}
          </ActionButton>
        }
      />

      <ShareTripModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        inviteUrl={inviteUrl}
      />

      <AlertModal
        isOpen={!!alertMsg}
        onClose={() => setAlertMsg('')}
        color="#0066D2"
        bg="#f0f6ff"
        icon={<AlertCircle size={28} color="#0066D2" />}
        actionLabel="Got it"
      >
        <p className="text-[15px] font-semibold text-[#0066D2]">{alertMsg}</p>
      </AlertModal>

      {/* Content area */}
      <div className="flex flex-col gap-[30px] px-4 lg:px-12">
        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px]">
          {actionCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <SummaryCard
                key={card.to}
                icon={<Icon size={24} />}
                title={card.title}
                subtitle={card.subtitle}
                to={card.to}
                delay={0.1 * i}
              />
            );
          })}
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[30px]">
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
                      <span className="text-[16px] text-[#0066D2]">{act.name}</span>
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
                    ${Number(tripDetails.budget).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[16px] text-[#0066D2]">Spent so far</span>
                  <span className="text-[20px] font-bold text-[#E53935]">
                    -${totalSpent.toLocaleString()}
                  </span>
                </div>

                {/* Divider */}
                <div className="h-[1px] bg-[#0066D2]/20" />

                <div className="flex items-center justify-between">
                  <span className="text-[18px] font-bold text-[#0066D2]">Remaining</span>
                  <span className="text-[22px] font-bold text-[#0066D2]">
                    ${remainingBudget.toLocaleString()}
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
