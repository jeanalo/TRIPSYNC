import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import CardHeader from '../CardHeader/CardHeader';

interface SummaryCardProps {
  icon: ReactNode;
  title: string;
  subtitle?: ReactNode;
  to?: string;
  delay?: number;
}

export default function SummaryCard({
  icon,
  title,
  subtitle,
  to,
  delay = 0,
}: SummaryCardProps) {
  const card = (
    <div className="flex h-[180px] flex-col justify-between rounded-[15px] bg-[#1CA698] p-[24px] transition-all duration-300 hover:shadow-lg hover:brightness-110">
      <CardHeader
        icon={icon}
        title={title}
        subtitle={subtitle}
        layout="vertical"
        size="sm"
        colorScheme="white"
        iconColor="teal"
      />
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      {to ? (
        <Link to={to} className="block no-underline">
          {card}
        </Link>
      ) : (
        card
      )}
    </motion.div>
  );
}
