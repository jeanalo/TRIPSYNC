import { useTravel } from '../../context/TravelContext';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  Plus,
  Wallet,
  TrendingDown,
  PieChart as PieIcon,
  ShoppingBag,
  Utensils,
  Car,
  Map,
  TriangleAlert,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function Budget() {
  const { tripDetails, expenses } = useTravel();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [hasViewedAlert, setHasViewedAlert] = useState(false);

  const totalBudget = Number(tripDetails.budget) || 0;
  const totalSpent = expenses.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const remaining = totalBudget - totalSpent;
  const isOverBudget = remaining < 0;

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    if (totalBudget > 0 && isOverBudget && !hasViewedAlert) {
      timeoutId = setTimeout(() => {
        setIsAlertOpen(true);
      }, 500);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isOverBudget, hasViewedAlert, totalBudget]);

  const handleDismissAlert = () => {
    setIsAlertOpen(false);
    setHasViewedAlert(true);
  };

  const expensesByCategory = expenses.reduce((acc: Record<string, number>, curr) => {
    const amount = Number(curr.amount) || 0;
    acc[curr.category] = (acc[curr.category] || 0) + amount;
    return acc;
  }, {});

  const data = Object.keys(expensesByCategory).map((key) => ({
    name: key,
    value: expensesByCategory[key],
  }));

  const COLORS = ['#a7c58e', '#5b8a6a', '#e8ddcb', '#d4183d', '#f59e0b', '#6366f1'];

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Food':
        return <Utensils className="w-5 h-5 text-orange-500" />;
      case 'Transport':
        return <Car className="w-5 h-5 text-blue-500" />;
      case 'Shopping':
        return <ShoppingBag className="w-5 h-5 text-pink-500" />;
      case 'Activities':
        return <Map className="w-5 h-5 text-green-500" />;
      default:
        return <Wallet className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-8 relative">
      {/* Over Budget Alert */}
      <AnimatePresence>
        {isAlertOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card w-full max-w-md rounded-xl shadow-2xl border border-destructive/20 overflow-hidden"
            >
              <div className="p-6 text-center space-y-4">
                <div className="mx-auto bg-destructive/10 p-3 rounded-full w-16 h-16 flex items-center justify-center">
                  <TriangleAlert className="w-8 h-8 text-destructive" />
                </div>
                <h2 className="text-xl font-bold text-destructive">Budget Alert!</h2>
                <p className="text-muted-foreground">
                  Watch out! You have exceeded your total budget by{' '}
                  <span className="font-bold text-destructive">
                    ${Math.abs(remaining).toFixed(2)}
                  </span>
                  .
                </p>
                <button
                  onClick={handleDismissAlert}
                  className="w-full py-3 bg-destructive hover:bg-destructive/90 text-destructive-foreground font-bold rounded-lg transition-colors"
                >
                  I understand
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Budget Tracker</h1>
          <p className="text-foreground/70">
            Keep your finances in check while you explore.
          </p>
        </div>
        <Link
          to="/app/budget/add"
          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg hover:bg-primary/90 transition-all active:scale-95 w-fit"
        >
          <Plus className="w-5 h-5" />
          Add Expense
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Overview Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card p-6 rounded-3xl shadow-lg border border-border/10"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/20 rounded-xl text-primary">
                <Wallet className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-card-foreground/70">
                Total Budget
              </span>
            </div>
            <p className="text-2xl font-bold text-card-foreground">
              ${totalBudget.toFixed(2)}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card p-6 rounded-3xl shadow-lg border border-border/10"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-500/20 rounded-xl text-red-500">
                <TrendingDown className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-card-foreground/70">Spent</span>
            </div>
            <p className="text-2xl font-bold text-card-foreground">
              ${totalSpent.toFixed(2)}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`bg-card p-6 rounded-3xl shadow-lg border border-border/10 relative overflow-hidden ${remaining < 0 ? 'border-red-500/20' : ''}`}
          >
            <div
              className={`absolute right-0 top-0 h-full w-2 ${remaining < 0 ? 'bg-red-500/20' : 'bg-green-500/20'}`}
            ></div>
            <div className="flex items-center gap-3 mb-2">
              <div
                className={`p-2 rounded-xl ${remaining < 0 ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`}
              >
                <Wallet className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-card-foreground/70">
                Remaining
              </span>
            </div>
            <p
              className={`text-2xl font-bold ${remaining < 0 ? 'text-red-500' : 'text-green-600'}`}
            >
              ${remaining.toFixed(2)}
            </p>
          </motion.div>
        </div>

        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-card p-4 md:p-6 rounded-3xl shadow-lg border border-border/10 row-span-2 flex flex-col items-center justify-center min-h-[300px]"
        >
          <h3 className="text-lg font-bold text-card-foreground mb-4 w-full flex items-center gap-2">
            <PieIcon className="w-5 h-5 text-muted-foreground" />
            Spending Breakdown
          </h3>
          {data.length > 0 ? (
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.map((_entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        stroke="none"
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      borderRadius: '12px',
                      border: 'none',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    }}
                    itemStyle={{ color: 'var(--card-foreground)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {data.map((entry, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 text-xs text-card-foreground/70"
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: COLORS[index % COLORS.length],
                      }}
                    ></div>
                    {entry.name}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              <p>No expenses yet.</p>
              <p className="text-sm">Add an expense to see the breakdown.</p>
            </div>
          )}
        </motion.div>

        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-card rounded-3xl shadow-lg border border-border/10 p-4 md:p-6">
          <h3 className="text-lg font-bold text-card-foreground mb-6">
            Recent Transactions
          </h3>
          <div className="space-y-4">
            {expenses.length > 0 ? (
              expenses.map((expense) => (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={expense.id}
                  className="flex items-center justify-between p-4 bg-background/50 rounded-2xl border border-border/5 hover:bg-background/80 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/10 rounded-xl">
                      {getCategoryIcon(expense.category)}
                    </div>
                    <div>
                      <p className="font-bold text-card-foreground">{expense.category}</p>
                      <p className="text-sm text-card-foreground/60">
                        {expense.notes || 'No notes'} • {expense.date}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-card-foreground">
                    -${(Number(expense.amount) || 0).toFixed(2)}
                  </span>
                </motion.div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No transactions recorded yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
