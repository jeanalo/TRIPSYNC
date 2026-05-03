import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Tag, Pencil, CalendarDays, CheckCircle, DollarSign, AlertTriangle } from 'lucide-react';

import { useTravel } from '../../context/TravelContext';
import PageHeader from '../../components/PageHeader/PageHeader';
import AlertModal from '../../components/AlertModal/AlertModal';
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
  const { addExpense, tripDetails, expenses } = useTravel();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: { category: 'Food', notes: '', amount: '', date: '' },
  });
  const [showOverBudgetModal, setShowOverBudgetModal] = useState(false);

  const totalBudget = Number(tripDetails.budget) || 0;
  const totalSpent = expenses.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const remaining = totalBudget - totalSpent;

  const onSubmit = (data: FormValues) => {
    const amount = parseFloat(data.amount) || 0;
    if (totalBudget > 0 && amount > remaining) {
      setShowOverBudgetModal(true);
      return;
    }
    addExpense({
      category: data.category,
      notes: data.notes,
      amount,
      date: data.date,
    });
    navigate('/app/budget');
  };

  return (
    <div>
      <AlertModal
        isOpen={showOverBudgetModal}
        onClose={() => setShowOverBudgetModal(false)}
        color="#E53935"
        bg="#FEECEB"
        icon={<AlertTriangle size={28} className="text-[#E53935]" />}
      >
        <div>
          <p className="text-xl font-bold text-[#E53935]">Over Budget</p>
          <p className="mt-2 text-sm text-gray-600">
            You no longer have the budget for this expense. You only have{' '}
            <span className="font-semibold">${remaining.toLocaleString()}</span> remaining.
          </p>
        </div>
      </AlertModal>

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
              <FormField label="Amount" icon={<DollarSign size={24} />}>
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
