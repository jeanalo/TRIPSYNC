import { useNavigate } from 'react-router-dom';
import { Plus, CalendarDays } from 'lucide-react';
import { useTravel } from '../../context/TravelContext';
import type { Activity } from '../../context/TravelContext';
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
  const { activities } = useTravel();

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
              <CardHeader icon={<CalendarDays size={24} />} title={formatDate(date)} />
            </DetailCard>
          ))
        )}
      </div>
    </div>
  );
};

export default Schedule;
