import { useTravel } from '../../context/TravelContext';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer } from 'recharts';
import {
  Plus,
  PieChart,
  Pencil,
  UtensilsCrossed,
  Building2,
  TrendingDown,
  Banknote,
  Wallet,
} from 'lucide-react';

import PageHeader from '../../components/ui/PageHeader';
import DetailCard from '../../components/ui/DetailCard';
import CardHeader from '../../components/ui/CardHeader';
import SummaryCard from '../../components/ui/SummaryCard';
import TransactionItem from '../../components/ui/TransactionItem';


const categoryIcons: Record<string, typeof UtensilsCrossed> = {
  Food: UtensilsCrossed,
  Accommodation: Building2,
};

const PIE_COLORS = ['#F2B705', '#1CA698', '#0066D2', '#6CD9CE', '#E53935'];

const DEMO_TRANSACTIONS = [
  { id: 'demo-1', category: 'Food', notes: 'Dinner at local market', date: '27-02-2026', amount: 45 },
  { id: 'demo-2', category: 'Accommodation', notes: 'Hotel deposit', date: '27-02-2026', amount: 98 },
];

const Budget = () => {
  const { tripDetails, expenses } = useTravel();

  const totalBudget = Number(tripDetails.budget) || 3500;
  const totalSpent = expenses.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0) || 1200;
  const remaining = totalBudget - totalSpent;

  const categoryTotals = expenses.length > 0
    ? expenses.reduce<Record<string, number>>((acc, e) => {
        const cat = e.category || 'Other';
        acc[cat] = (acc[cat] || 0) + (Number(e.amount) || 0);
        return acc;
      }, {})
    : { Food: 45, Accommodation: 98 };

  const chartData = Object.entries(categoryTotals).map(
    ([name, value], i) => ({ name, value, color: PIE_COLORS[i % PIE_COLORS.length] }),
  );

  const transactions = expenses.length > 0 ? expenses : DEMO_TRANSACTIONS;

  const summaryCards = [
    { title: 'Total Budget', value: `$${totalBudget.toLocaleString()}`, icon: Banknote, hasEdit: true },
    { title: 'Spent', value: `$${totalSpent.toLocaleString()}`, icon: TrendingDown, hasEdit: false },
    { title: 'Remaining', value: `$${remaining.toLocaleString()}`, icon: Wallet, hasEdit: false },
  ];

  return (
    <div>
      {/* Header */}
      <PageHeader
        title="Budget Tracker"
        subtitle="Keep your finances in check while you explore."
        action={
          <Link to="/app/budget/add" className="no-underline">
            <motion.button
              className="flex items-center gap-2 rounded-[15px] border-none bg-[#0066D2] px-6 py-3 text-[18px] font-semibold text-[#F5F5F5] cursor-pointer transition-all duration-300 hover:bg-[#0055b0] hover:shadow-lg"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Plus size={22} />
              Add Expense
            </motion.button>
          </Link>
        }
      />

      {/* Content area */}
      <div className="flex items-stretch gap-[30px] px-12">
        {/* LEFT: summary cards + transactions */}
        <div className="flex flex-1 flex-col gap-[24px]">
          {/* Summary cards row */}
          <div className="grid grid-cols-3 gap-[20px]">
            {summaryCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <SummaryCard
                  key={card.title}
                  icon={<Icon size={24} />}
                  title={card.title}
                  subtitle={
                    <div className="flex items-center gap-3">
                      {card.hasEdit && <Pencil size={16} />}
                      <span>{card.value}</span>
                    </div>
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
                />
              ))}
            </div>
          </DetailCard>
        </div>

        {/* RIGHT: Spending Breakdown */}
        <DetailCard className="w-[262px] shrink-0" delay={0.5}>
          <div className="flex h-full flex-col items-center gap-9">
            <CardHeader
              icon={<PieChart size={24} />}
              title="Spending Breakdown"
              layout="vertical"
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
