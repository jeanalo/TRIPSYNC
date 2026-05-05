import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useTravel } from '../../context/TravelContext';
import PageHeader from '../../components/PageHeader/PageHeader';
import ActionButton from '../../components/ActionButton/ActionButton';
import DetailCard from '../../components/DetailCard/DetailCard';

const Schedule = () => {
  const navigate = useNavigate();
  const { activities } = useTravel();

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
        {activities.length === 0 && (
          <DetailCard delay={0.2}>
            <p className="text-center text-[18px] text-[#0066D2]/50 py-8">
              No activities yet. Add your first activity!
            </p>
          </DetailCard>
        )}
      </div>
    </div>
  );
};

export default Schedule;
