import { useState, useRef, useEffect } from 'react';
import { useTravel } from '../../context/TravelContext';
import { motion, AnimatePresence } from 'motion/react';
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer } from 'recharts';
import {
  Plus,
  PieChart,
  Pencil,
  Check,
  X,
  UtensilsCrossed,
  Building2,
  TrendingDown,
  Banknote,
  Wallet,
  Car,
  Compass,
  ShoppingBag,
  FileText,
  AlertTriangle,
} from 'lucide-react';

import PageHeader from '../../components/PageHeader/PageHeader';
import ActionButton from '../../components/ActionButton/ActionButton';
import DetailCard from '../../components/DetailCard/DetailCard';
import CardHeader from '../../components/CardHeader/CardHeader';
import SummaryCard from '../../components/SummaryCard/SummaryCard';
import TransactionItem from '../../components/TransactionItem/TransactionItem';

const categoryIcons: Record<string, typeof UtensilsCrossed> = {
  Food: UtensilsCrossed,
  Transport: Car,
  Accommodation: Building2,
  Activities: Compass,
  Shopping: ShoppingBag,
  Other: FileText,
};

const PIE_COLORS = ['#F2B705', '#1CA698', '#0066D2', '#6CD9CE', '#E53935'];

const DEMO_TRANSACTIONS = [
  {
    id: 'demo-1',
    category: 'Food',
    notes: 'Dinner at local market',
    date: '27-02-2026',
    amount: 45,
  },
  {
    id: 'demo-2',
    category: 'Accommodation',
    notes: 'Hotel deposit',
    date: '27-02-2026',
    amount: 98,
  },
];

const THRESHOLDS = [30, 50, 70, 90] as const;

const THRESHOLD_CONFIG: Record<number, { color: string; bg: string; message: string }> = {
  30: {
    color: '#F2B705',
    bg: '#FEF9E7',
    message: "You've used 30% of your budget. Still plenty left — keep it up!",
  },
  50: {
    color: '#F2B705',
    bg: '#FEF9E7',
    message: 'Halfway through your budget. Time to keep a closer eye on spending.',
  },
  70: {
    color: '#E8890C',
    bg: '#FDF3E7',
    message: '70% of your budget is spent. Consider cutting back on non-essentials.',
  },
  90: {
    color: '#E53935',
    bg: '#FEECEB',
    message: 'Almost out of budget! Only 10% remains — spend wisely.',
  },
};

const Budget = () => {
  const { tripDetails, setTripDetails, expenses, deleteExpense } = useTravel();

  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [budgetDraft, setBudgetDraft] = useState('');
  const [activeAlert, setActiveAlert] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const shownThresholds = useRef<Set<number>>(new Set());

  const totalBudget = Number(tripDetails.budget) || 0;

  const startEditing = () => {
    setBudgetDraft(String(totalBudget));
    setIsEditingBudget(true);
  };

  const confirmEdit = () => {
    const newBudget = Number(budgetDraft);
    if (!isNaN(newBudget) && newBudget >= 0) {
      setTripDetails({ ...tripDetails, budget: newBudget });
    }
    setIsEditingBudget(false);
  };

  const cancelEdit = () => {
    setIsEditingBudget(false);
  };

  useEffect(() => {
    if (isEditingBudget && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingBudget]);

  const totalSpent = expenses.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

  useEffect(() => {
    if (totalBudget <= 0) return;
    const pct = (totalSpent / totalBudget) * 100;
    for (const threshold of [...THRESHOLDS].reverse()) {
      if (pct >= threshold && !shownThresholds.current.has(threshold)) {
        shownThresholds.current.add(threshold);
        setActiveAlert(threshold);
        break;
      }
    }
  }, [totalSpent, totalBudget]);
  const remaining = totalBudget - totalSpent;

  const categoryTotals =
    expenses.length > 0
      ? expenses.reduce<Record<string, number>>((acc, e) => {
          const cat = e.category || 'Other';
          acc[cat] = (acc[cat] || 0) + (Number(e.amount) || 0);
          return acc;
        }, {})
      : { Food: 45, Accommodation: 98 };

  const chartData = Object.entries(categoryTotals).map(([name, value], i) => ({
    name,
    value,
    color: PIE_COLORS[i % PIE_COLORS.length],
  }));

  const transactions = expenses.length > 0 ? expenses : DEMO_TRANSACTIONS;

  const summaryCards = [
    {
      title: 'Total Budget',
      value: `$${totalBudget.toLocaleString()}`,
      icon: Banknote,
      hasEdit: true,
    },
    {
      title: 'Spent',
      value: `$${totalSpent.toLocaleString()}`,
      icon: TrendingDown,
      hasEdit: false,
    },
    {
      title: 'Remaining',
      value: `$${remaining.toLocaleString()}`,
      icon: Wallet,
      hasEdit: false,
    },
  ];

  return (
    <div>
      {/* Budget threshold alert modal */}
      <AnimatePresence>
        {activeAlert !== null &&
          (() => {
            const cfg = THRESHOLD_CONFIG[activeAlert];
            return (
              <motion.div
                key="budget-alert-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
                onClick={() => setActiveAlert(null)}
              >
                <motion.div
                  key="budget-alert-card"
                  initial={{ scale: 0.85, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.85, opacity: 0, y: 20 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  className="relative w-full max-w-sm rounded-2xl p-6 shadow-xl"
                  style={{ backgroundColor: cfg.bg }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => setActiveAlert(null)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={18} />
                  </button>

                  <div className="flex flex-col items-center gap-4 text-center">
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-full"
                      style={{ backgroundColor: cfg.color + '22' }}
                    >
                      <AlertTriangle size={28} style={{ color: cfg.color }} />
                    </div>

                    <div>
                      <p className="text-3xl font-bold" style={{ color: cfg.color }}>
                        {activeAlert}% spent
                      </p>
                      <p className="mt-2 text-sm text-gray-600">{cfg.message}</p>
                    </div>

                    <div className="w-full rounded-full bg-gray-200 h-2">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{ width: `${activeAlert}%`, backgroundColor: cfg.color }}
                      />
                    </div>

                    <button
                      onClick={() => setActiveAlert(null)}
                      className="mt-1 w-full rounded-xl py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                      style={{ backgroundColor: cfg.color }}
                    >
                      Got it
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            );
          })()}
      </AnimatePresence>

      {/* Header */}
      <PageHeader
        title="Budget Tracker"
        subtitle="Keep your finances in check while you explore."
        action={
          <ActionButton icon={<Plus size={22} />} to="/app/budget/add">
            Add Expense
          </ActionButton>
        }
      />

      {/* Content area */}
      <div className="flex flex-col lg:flex-row items-start gap-[30px] px-4 lg:px-12">
        {/* LEFT: summary cards + transactions */}
        <div className="flex flex-1 flex-col gap-[24px]">
          {/* Summary cards row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px]">
            {summaryCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <SummaryCard
                  key={card.title}
                  icon={<Icon size={24} />}
                  title={card.title}
                  subtitle={
                    card.hasEdit && isEditingBudget ? (
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[#FFFFFF] font-bold">$</span>
                        <input
                          ref={inputRef}
                          type="number"
                          min="0"
                          value={budgetDraft}
                          onChange={(e) => setBudgetDraft(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') confirmEdit();
                            if (e.key === 'Escape') cancelEdit();
                          }}
                          className="w-[100px] h-[24px] rounded-lg border border-[#FFFFFF] bg-white/80 px-2 py-1 text-[16px] font-bold text-[#1CA698] outline-none focus:ring-2 focus:ring-[#FFFFFF]/30"
                        />
                        <button
                          onClick={confirmEdit}
                          className="flex items-center justify-center rounded-full bg-[#1CA698] p-1 border-none cursor-pointer text-white hover:bg-[#17907f] transition-colors"
                          title="Confirm"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="flex items-center justify-center rounded-full bg-[#E53935] p-1 border-none cursor-pointer text-white hover:bg-[#c62828] transition-colors"
                          title="Cancel"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        {card.hasEdit && (
                          <Pencil
                            size={16}
                            className="cursor-pointer text-[#FFFFFF] hover:scale-125 transition-transform"
                            onClick={startEditing}
                          />
                        )}
                        <span>{card.value}</span>
                      </div>
                    )
                  }
                  delay={0.1 * i}
                />
              );
            })}
          </div>

          {/* Recent Transactions */}
          <DetailCard delay={0.4}>
            <div className="flex flex-col gap-5">
              <h2 className="text-[20px] font-bold leading-[36px] text-[#0066D2]">
                Recent Transactions
              </h2>

              {transactions.map((tx, idx) => (
                <TransactionItem
                  key={tx.id}
                  icon={categoryIcons[tx.category]}
                  category={tx.category}
                  description={`${tx.notes || 'No notes'} • ${tx.date}`}
                  amount={Number(tx.amount) || 0}
                  showDivider={idx > 0}
                  onDelete={expenses.length > 0 ? () => deleteExpense(tx.id) : undefined}
                />
              ))}
            </div>
          </DetailCard>
        </div>

        {/* RIGHT: Spending Breakdown */}
        <DetailCard className="w-full lg:w-[262px] shrink-0" delay={0.5}>
          <div className="flex h-full flex-col items-center gap-9">
            <CardHeader
              icon={<PieChart size={24} />}
              title="Spending Breakdown"
              layout="horizontal"
              size="sm"
            />
            <ResponsiveContainer width={180} height={180}>
              <RechartsPie>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {chartData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </RechartsPie>
            </ResponsiveContainer>
            <div className="flex flex-col items-center gap-1">
              {chartData.map((entry) => (
                <div key={entry.name} className="flex items-center gap-3">
                  <span
                    className="inline-block h-[13px] w-[13px] rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-[16px] leading-[36px] text-[#0066D2]">
                    {entry.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </DetailCard>
      </div>
    </div>
  );
};

export default Budget;
