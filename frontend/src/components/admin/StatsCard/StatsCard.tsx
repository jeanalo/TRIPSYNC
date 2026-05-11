import { motion } from 'motion/react';
import type { ReactNode } from 'react';

interface StatsCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  delay?: number;
}

export default function StatsCard({
  icon,
  label,
  value,
  delay = 0,
}: StatsCardProps) {
  return (
    <motion.div
      className="flex flex-col gap-3 rounded-2xl bg-gradient-to-br from-[#1CA698] to-[#17897d] px-6 py-5 shadow-sm transition-shadow duration-300 hover:shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      
      <div className="flex h-[42px] w-[42px] items-center justify-center rounded-xl bg-white/20 text-white">
        {icon}
      </div>

      
      <span className="text-[13px] font-medium text-white/80">{label}</span>

      
      <span className="text-[28px] font-bold leading-tight text-white">
        {value}
      </span>
    </motion.div>
  );
}
