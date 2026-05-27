import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

interface ActionButtonProps {
  children: ReactNode;
  icon?: ReactNode;
  onClick?: () => void;
  to?: string;
  disabled?: boolean;
}

export default function ActionButton({ children, icon, onClick, to, disabled }: ActionButtonProps) {
  const button = (
    <motion.button
      type="button"
      disabled={disabled}
      className="flex items-center gap-2 rounded-[15px] border-none bg-[#0066D2] px-6 py-3 text-[16px] font-semibold text-white cursor-pointer transition-all duration-300 hover:bg-[#0055b0] hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
    >
      {icon}
      {children}
    </motion.button>
  );

  if (to) {
    return <Link to={to} className="no-underline">{button}</Link>;
  }

  return button;
}
