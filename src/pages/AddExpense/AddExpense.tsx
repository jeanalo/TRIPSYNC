import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Tag, Pencil, CalendarDays, CheckCircle, DollarSign, AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
      <AnimatePresence>
        {showOverBudgetModal && (
          <motion.div
            key="over-budget-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
            onClick={() => setShowOverBudgetModal(false)}
          >
            <motion.div
              key="over-budget-card"
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="relative w-full max-w-sm rounded-2xl bg-[#FEECEB] p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowOverBudgetModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={18} />
              </button>

              <div className="flex flex-col items-center gap-4 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E5393522]">
                  <AlertTriangle size={28} className="text-[#E53935]" />
                </div>

                <div>
                  <p className="text-xl font-bold text-[#E53935]">Over Budget</p>
                  <p className="mt-2 text-sm text-gray-600">
                    You no longer have the budget for this expense. You only have{' '}
                    <span className="font-semibold">${remaining.toLocaleString()}</span> remaining.
                  </p>
                </div>

                <button
                  onClick={() => setShowOverBudgetModal(false)}
                  className="mt-1 w-full rounded-xl py-2.5 text-sm font-semibold text-white bg-[#E53935] hover:opacity-90 transition-opacity"
                >
                  Got it
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
