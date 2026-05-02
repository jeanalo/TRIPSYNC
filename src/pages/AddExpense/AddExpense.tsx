import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Tag, Pencil, ShoppingCart, CalendarDays, CheckCircle } from 'lucide-react';

import { useTravel } from '../../context/TravelContext';
import PageHeader from '../../components/PageHeader/PageHeader';
import FormCard from '../../components/FormCard/FormCard';
import FormField from '../../components/FormField/FormField';
import SubmitButton from '../../components/SubmitButton/SubmitButton';

type FormValues = {
  category: string;
  notes: string;
  amount: string;
  date: string;
};

const CATEGORIES = [
  'Food',
  'Transport',
  'Accommodation',
  'Activities',
  'Shopping',
  'Other',
];

export default function AddExpense() {
  const { addExpense } = useTravel();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: { category: 'Food', notes: '', amount: '', date: '' },
  });

  const onSubmit = (data: FormValues) => {
    addExpense({
      category: data.category,
      notes: data.notes,
      amount: parseFloat(data.amount) || 0,
      date: data.date,
    });
    navigate('/app/budget');
  };

  return (
    <div>
      <PageHeader title="Add New Expense" subtitle="Track your spending on the go." />

      <div className="px-12">
        <FormCard as="form" onSubmit={handleSubmit(onSubmit)} className="w-[803px]">
          <div className="flex flex-col gap-[45px]">
            <div className="grid grid-cols-2 gap-[65px]">
              <FormField label="Category" icon={<Tag size={24} />}>
                <select
                  {...register('category', { required: true })}
                  className="h-full w-full border-none bg-transparent text-[20px] leading-[36px] text-[#1CA698] outline-none cursor-pointer"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label="Description" icon={<Pencil size={24} />}>
                <input
                  type="text"
                  {...register('notes')}
                  placeholder="e.g. Dinner at local market"
                  className="h-full w-full border-none bg-transparent text-[20px] leading-[36px] text-[#1CA698] placeholder:text-[#1CA698]/40 outline-none"
                />
              </FormField>
            </div>

            <div className="grid grid-cols-2 gap-[65px]">
              <FormField label="Amount" icon={<ShoppingCart size={24} />}>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register('amount', { required: true, min: 0 })}
                  placeholder="0.00"
                  className="h-full w-full border-none bg-transparent text-[20px] leading-[36px] text-[#1CA698] placeholder:text-[#1CA698]/40 outline-none"
                />
              </FormField>

              <FormField label="Date" icon={<CalendarDays size={24} />}>
                <input
                  type="date"
                  {...register('date', { required: true })}
                  className="h-full w-full border-none bg-transparent text-[20px] leading-[36px] text-[#1CA698] outline-none"
                />
              </FormField>
            </div>

            <SubmitButton icon={<CheckCircle size={24} />}>Save Expense</SubmitButton>
          </div>
        </FormCard>
      </div>
    </div>
  );
}
