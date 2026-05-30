import { useState, useEffect, useRef } from 'react';

const THRESHOLDS = [30, 50, 70, 90, 100] as const;

export const THRESHOLD_CONFIG: Record<number, { color: string; bg: string; message: string }> = {
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

export function useBudgetAlert(totalSpent: number, totalBudget: number) {
  const [activeAlert, setActiveAlert] = useState<number | null>(null);
  const shownThresholds = useRef<Set<number>>(new Set());

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

  return { activeAlert, setActiveAlert };
}
