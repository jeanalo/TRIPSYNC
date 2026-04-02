import { motion } from 'motion/react';

interface PageHeaderProps {
  title: string;
  subtitle: string | React.ReactNode;
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <motion.div
      className="px-12 py-[73px] pb-0"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8 flex flex-col gap-1">
        <h1 className="text-[30px] font-bold leading-[36px] text-[#0066D2]">
          {title}
        </h1>
        <p className="text-[16px] leading-[24px] text-[#0066D2]">
          {subtitle}
        </p>
      </div>
    </motion.div>
  );
}
