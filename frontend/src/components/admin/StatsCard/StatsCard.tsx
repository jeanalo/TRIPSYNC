import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import CardHeader from '@/components/CardHeader/CardHeader';

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
      className="flex h-[180px] flex-col justify-between rounded-[15px] bg-[#1CA698] p-[24px] transition-all duration-300 hover:shadow-lg hover:brightness-110"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <CardHeader
        icon={icon}
        title={label}
        subtitle={String(value)}
        layout="vertical"
        size="sm"
        colorScheme="white"
        iconColor="teal"
      />
    </motion.div>
  );
}
