import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { useTravel } from '../../context/TravelContext';
import PageHeader from '../../components/PageHeader/PageHeader';
import FormCard from '../../components/FormCard/FormCard';
import SubmitButton from '../../components/SubmitButton/SubmitButton';

type FormValues = {
  name: string;
  date: string;
  time: string;
  location: string;
  category: string;
  notes: string;
};

export default function AddActivity() {
  const { addActivity } = useTravel();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      name: '',
      date: '',
      time: '',
      location: '',
      category: 'Free Tour',
      notes: '',
    },
  });

  const onSubmit = (data: FormValues) => {
    addActivity(data);
    navigate('/app/schedule');
  };

  return (
    <div>
      <PageHeader title="Add New Activity" subtitle="Plan your day." />

      <div className="px-4 lg:px-12">
        <FormCard as="form" onSubmit={handleSubmit(onSubmit)} className="lg:w-[803px]">
          <div className="flex flex-col gap-[45px]">
            <SubmitButton icon={<CheckCircle size={24} />}>Save Activity</SubmitButton>
          </div>
        </FormCard>
      </div>
    </div>
  );
}
