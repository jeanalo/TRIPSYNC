import { useParams } from 'react-router-dom';
import { useExpenseActivity } from '../../context/ExpenseActivityProvider';
import PageHeader from '../../components/PageHeader/PageHeader';

const EditActivity = () => {
  const { id } = useParams<{ id: string }>();
  const { activities } = useExpenseActivity();
  const activity = activities.find((a) => a.id === id);

  return (
    <div>
      <PageHeader title="Edit Activity" subtitle="Update your plan." />
    </div>
  );
};

export default EditActivity;
