import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Tag, Pencil, CalendarDays, Clock, MapPin, CheckCircle } from 'lucide-react';
import { useExpenseActivity } from '../../context/ExpenseActivityProvider';
import PageHeader from '../../components/PageHeader/PageHeader';
import FormCard from '../../components/FormCard/FormCard';
import FormField from '../../components/FormField/FormField';
import SubmitButton from '../../components/SubmitButton/SubmitButton';

type FormValues = {
  name: string;
  date: string;
  time: string;
  location: string;
  category: string;
  notes: string;
};

const CATEGORIES = ['Free Tour', 'Adventure', 'Cultural', 'Chill', 'Food', 'Transport', 'Other'];

const EditActivity = () => {
  const { id } = useParams<{ id: string }>();
  const { activities, updateActivity } = useExpenseActivity();
  const navigate = useNavigate();
  const activity = activities.find((a) => a.id === id);

  const { register, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: { name: '', date: '', time: '', location: '', category: 'Free Tour', notes: '' },
  });

  useEffect(() => {
    if (!activity) return;
    reset({
      name: activity.name,
      date: activity.date,
      time: activity.time,
      location: activity.location,
      category: activity.category,
      notes: activity.notes,
    });
  }, [activity, reset]);

  const onSubmit = async (data: FormValues) => {
    if (!id) return;
    await updateActivity(id, data);
    navigate('/app/schedule');
  };

  return (
    <div>
      <PageHeader title="Edit Activity" subtitle="Update your plan." />
      <div className="px-4 lg:px-12">
        <FormCard as="form" onSubmit={handleSubmit(onSubmit)} className="lg:w-[803px]">
          <div className="flex flex-col gap-[45px]">
            <FormField label="Activity Name" icon={<Pencil size={24} />}>
              <input
                type="text"
                {...register('name', { required: true })}
                placeholder="e.g. Tokio Free Tour"
                className="h-full w-full border-none bg-transparent text-[20px] leading-[36px] text-[#1CA698] placeholder:text-[#1CA698]/40 outline-none"
              />
            </FormField>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[45px] md:gap-[65px]">
              <FormField label="Date" icon={<CalendarDays size={24} />}>
                <input
                  type="date"
                  {...register('date', { required: true })}
                  className="h-full w-full border-none bg-transparent text-[20px] leading-[36px] text-[#1CA698] outline-none"
                />
              </FormField>
              <FormField label="Time" icon={<Clock size={24} />}>
                <input
                  type="time"
                  {...register('time', { required: true })}
                  className="h-full w-full border-none bg-transparent text-[20px] leading-[36px] text-[#1CA698] outline-none"
                />
              </FormField>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[45px] md:gap-[65px]">
              <FormField label="Location" icon={<MapPin size={24} />}>
                <input
                  type="text"
                  {...register('location')}
                  placeholder="e.g. City Center"
                  className="h-full w-full border-none bg-transparent text-[20px] leading-[36px] text-[#1CA698] placeholder:text-[#1CA698]/40 outline-none"
                />
              </FormField>
              <FormField label="Category" icon={<Tag size={24} />}>
                <select
                  {...register('category')}
                  className="h-full w-full border-none bg-transparent text-[20px] leading-[36px] text-[#1CA698] outline-none cursor-pointer"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </FormField>
            </div>
            <FormField label="Details" icon={<Pencil size={24} />}>
              <input
                type="text"
                {...register('notes')}
                placeholder="Amazing experience."
                className="h-full w-full border-none bg-transparent text-[20px] leading-[36px] text-[#1CA698] placeholder:text-[#1CA698]/40 outline-none"
              />
            </FormField>
            <SubmitButton icon={<CheckCircle size={24} />}>Update Activity</SubmitButton>
          </div>
        </FormCard>
      </div>
    </div>
  );
};

export default EditActivity;
