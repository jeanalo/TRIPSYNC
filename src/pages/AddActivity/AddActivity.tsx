import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/PageHeader/PageHeader';

type FormValues = {
  name: string;
  date: string;
  time: string;
  location: string;
  category: string;
  notes: string;
};

export default function AddActivity() {
  const navigate = useNavigate();

  return (
    <div>
      <PageHeader title="Add New Activity" subtitle="Plan your day." />
    </div>
  );
}
