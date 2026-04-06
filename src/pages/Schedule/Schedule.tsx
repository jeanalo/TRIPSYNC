import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import ActionButton from '../../components/ui/ActionButton';

const Schedule = () => {
    const navigate = useNavigate();

  return (
    <div>
      <PageHeader
        title="Travel Schedule"
        subtitle="Soon you can plan your trip."
        action={
          <ActionButton icon={<Plus size={24} />} onClick={() => navigate('/app/schedule/add')}>
            Add Activity
          </ActionButton>
        }
      />
    </div>
  );
};

export default Schedule;
