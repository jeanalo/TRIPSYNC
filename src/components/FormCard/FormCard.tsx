import { motion } from 'motion/react';

interface FormCardProps {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'form';
  onSubmit?: (e: React.FormEvent) => void;
  delay?: number;
}

export default function FormCard({
  children,
  className = '',
  as = 'div',
  onSubmit,
  delay = 0.2,
}: FormCardProps) {
  const Component = as === 'form' ? motion.form : motion.div;

  return (
    <Component
      onSubmit={onSubmit}
      className={`rounded-[15px] border-2 border-[#6cd9ce] bg-[rgba(108,217,206,0.25)] px-[44px] py-[42px] ${className}`}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
    >
      {children}
    </Component>
  );
}
