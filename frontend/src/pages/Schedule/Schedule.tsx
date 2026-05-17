import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, CalendarDays, MapPin, Tag, FileText } from 'lucide-react';
import { motion } from 'motion/react';
import { useExpenseActivity } from '../../context/ExpenseActivityProvider';
import type { Activity } from '../../types/travel.types';
import PageHeader from '../../components/PageHeader/PageHeader';
import ActionButton from '../../components/ActionButton/ActionButton';
import DetailCard from '../../components/DetailCard/DetailCard';
import CardHeader from '../../components/CardHeader/CardHeader';

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

function groupByDate(activities: Activity[]): Record<string, Activity[]> {
  return activities.reduce(
    (acc, act) => {
      if (!acc[act.date]) acc[act.date] = [];
      acc[act.date].push(act);
      return acc;
    },
    {} as Record<string, Activity[]>
  );
}

const Schedule = () => {
  const navigate = useNavigate();
  const { activities } = useExpenseActivity();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const grouped = groupByDate(activities);
  const sortedDates = Object.keys(grouped).sort();

  return (
    <div>
      <PageHeader
        title="Travel Schedule"
        subtitle="Your personalized itinerary."
        action={
          <ActionButton
            icon={<Plus size={24} />}
            onClick={() => navigate('/app/schedule/add')}
          >
            Add Activity
          </ActionButton>
        }
      />

      <div className="flex flex-col gap-[30px] px-4 lg:px-12 pb-12">
        {activities.length === 0 ? (
          <DetailCard delay={0.2}>
            <p className="text-center text-[18px] text-[#0066D2]/50 py-8">
              No activities yet. Add your first activity!
            </p>
          </DetailCard>
        ) : (
          sortedDates.map((date, i) => (
            <DetailCard key={date} delay={0.2 + i * 0.1}>
              <div className="flex flex-col gap-6">
                <CardHeader icon={<CalendarDays size={24} />} title={formatDate(date)} />
                <div className="flex flex-col">
                  {grouped[date]
                    .sort((a, b) => a.time.localeCompare(b.time))
                    .map((activity, index) => (
                      <div
                        key={activity.id}
                        className={index > 0 ? 'border-t border-[#0066D2]/15' : ''}
                      >
                        <div className="flex items-center justify-between py-5">
                          <div className="flex items-center gap-[45px]">
                            <span className="text-[22px] font-bold text-[#0066D2] min-w-[64px]">
                              {activity.time}
                            </span>
                            <div className="flex flex-col gap-1">
                              <span className="text-[22px] font-bold text-[#0066D2]">
                                {activity.name}
                              </span>
                              <div className="flex items-center gap-3">
                                {activity.location && (
                                  <div className="flex items-center gap-1.5">
                                    <MapPin size={20} className="text-[#0066D2]" />
                                    <span className="text-[18px] text-[#0066D2]">
                                      {activity.location}
                                    </span>
                                  </div>
                                )}
                                {activity.location && activity.category && (
                                  <div className="h-[23px] w-px bg-[#0066D2]/30" />
                                )}
                                {activity.category && (
                                  <div className="flex items-center gap-1.5">
                                    <Tag size={20} className="text-[#F2B705]" />
                                    <span className="text-[18px] text-[#0066D2]">
                                      {activity.category}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            className="bg-[#0066D2] text-white font-semibold text-[18px] px-8 py-3 rounded-[15px] cursor-pointer border-none hover:bg-[#0055b0] transition-colors shrink-0"
                            onClick={() =>
                              setSelectedId(
                                selectedId === activity.id ? null : activity.id
                              )
                            }
                          >
                            {selectedId === activity.id ? 'Close' : 'Details'}
                          </button>
                        </div>
                        {selectedId === activity.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="border-t border-[#0066D2]/15 pt-4 pb-5 flex flex-col gap-3 text-[14px] text-[#0066D2] overflow-hidden"
                          >
                            <span className="font-semibold text-[16px]">
                              {activity.name}
                            </span>
                            <div className="flex items-center gap-2">
                              <CalendarDays
                                size={16}
                                className="text-[#0066D2] shrink-0"
                              />
                              <span>
                                {formatDate(activity.date)} &middot; {activity.time}
                              </span>
                            </div>
                            {activity.location && (
                              <div className="flex items-center gap-2">
                                <MapPin size={16} className="text-[#0066D2] shrink-0" />
                                <span>{activity.location}</span>
                              </div>
                            )}
                            {activity.category && (
                              <div className="flex items-center gap-2">
                                <Tag size={16} className="text-[#F2B705] shrink-0" />
                                <span>{activity.category}</span>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </DetailCard>
          ))
        )}
      </div>
    </div>
  );
};

export default Schedule;
