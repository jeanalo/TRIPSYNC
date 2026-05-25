import { motion } from 'motion/react';
import type { ReactNode } from 'react';

interface DetailCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  animateFrom?: 'bottom' | 'left' | 'right';
}

export default function DetailCard({
  children,
  className = '',
  delay = 0.3,
  animateFrom = 'bottom',
}: DetailCardProps) {
  const initialMap = {
    bottom: { opacity: 0, y: 20 },
    left: { opacity: 0, x: -20 },
    right: { opacity: 0, x: 20 },
  };

  const animateMap = {
    bottom: { opacity: 1, y: 0 },
    left: { opacity: 1, x: 0 },
    right: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      className={`rounded-[15px] border-2 border-[#0066D2] bg-white px-[32px] py-[30px] ${className}`}
      initial={initialMap[animateFrom]}
      animate={animateMap[animateFrom]}
      transition={{ duration: 0.4, delay }}
    >
      {children}
    </motion.div>
  );
}
