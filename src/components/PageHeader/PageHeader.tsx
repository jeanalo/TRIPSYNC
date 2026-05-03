import { motion } from 'motion/react';
import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle: string | ReactNode;
  action?: ReactNode;
}

export default function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <motion.div
      className="px-4 lg:px-12 pt-8 lg:pt-[73px] pb-8 lg:pb-[42px]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row items-start justify-between gap-4 md:gap-0">
        <div className="flex flex-col gap-1">
          <h1 className="text-[30px] font-bold leading-[36px] text-[#0066D2]">
            {title}
          </h1>
          <p className="text-[16px] leading-[24px] text-[#0066D2]">
            {subtitle}
          </p>
        </div>
        {action && <div className="shrink-0 w-full md:w-auto">{action}</div>}
      </div>
    </motion.div>
  );
}
