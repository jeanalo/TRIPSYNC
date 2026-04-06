import { motion } from 'motion/react';
import type { ReactNode } from 'react';

interface SubmitButtonProps {
  children: ReactNode;
  icon?: ReactNode;
  loading?: boolean;
  loadingText?: string;
  disabled?: boolean;
  type?: 'submit' | 'button';
}

export default function SubmitButton({
  children,
  icon,
  loading = false,
  loadingText = 'Loading...',
  disabled = false,
  type = 'submit',
}: SubmitButtonProps) {
  return (
    <motion.button
      type={type}
      disabled={disabled || loading}
      className="flex h-[52px] w-full cursor-pointer items-center justify-center gap-1 rounded-[15px] border-none bg-[#0066D2] text-[18px] font-semibold leading-[24px] text-[#F5F5F5] transition-all duration-300 hover:bg-[#0055b0] hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
    >
      {loading ? (
        loadingText
      ) : (
        <>
          {icon}
          <span>{children}</span>
        </>
      )}
    </motion.button>
  );
}
