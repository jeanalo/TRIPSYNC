import { useState, useRef, useEffect } from 'react';
import { useTravel } from '../../context/TravelContext';
import {
  PieChart as RechartsPie,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
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
  BarChart2,
} from 'lucide-react';

import PageHeader from '../../components/PageHeader/PageHeader';
import ActionButton from '../../components/ActionButton/ActionButton';
import AlertModal from '../../components/AlertModal/AlertModal';
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

const THRESHOLDS = [30, 50, 70, 90, 100] as const;

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
  100: {
    color: '#B71C1C',
    bg: '#FEECEB',
    message:
      'Your budget is completely spent. No funds remain — review your expenses before adding more.',
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
      {activeAlert !== null && (() => {
        const cfg = THRESHOLD_CONFIG[activeAlert];
        return (
          <AlertModal
            isOpen
            onClose={() => setActiveAlert(null)}
            color={cfg.color}
            bg={cfg.bg}
            icon={<AlertTriangle size={28} style={{ color: cfg.color }} />}
          >
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
          </AlertModal>
        );
      })()}

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
      <div className="flex flex-col gap-[24px] px-4 lg:px-12">
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

        {/* Spending Breakdown + Bar Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[24px]">
          <DetailCard delay={0.4}>
            <div className="flex flex-col gap-5">
              <CardHeader
                icon={<PieChart size={24} />}
                title="Expense Summary"
                layout="horizontal"
                size="sm"
              />
              <div className="flex flex-col sm:flex-row items-center gap-6">
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
                <div className="flex flex-col gap-2">
                  {chartData.map((entry) => (
                    <div key={entry.name} className="flex items-center gap-3">
                      <span
                        className="inline-block h-[13px] w-[13px] shrink-0 rounded-full"
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="text-[16px] text-[#0066D2]">{entry.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DetailCard>

          <DetailCard delay={0.45}>
            <div className="flex flex-col gap-5">
              <CardHeader
                icon={<BarChart2 size={24} />}
                title="Spending by Category"
                layout="horizontal"
                size="sm"
              />
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={chartData} barCategoryGap="30%">
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12, fill: '#0066D2' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: '#0066D2' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `$${v}`}
                  />
                  <Tooltip
                    formatter={(value) => [`$${value ?? 0}`, 'Spent']}
                    contentStyle={{
                      borderRadius: 8,
                      border: 'none',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                    }}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </DetailCard>
        </div>

        {/* Recent Transactions */}
        <DetailCard delay={0.5}>
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
    </div>
  );
};

export default Budget;
