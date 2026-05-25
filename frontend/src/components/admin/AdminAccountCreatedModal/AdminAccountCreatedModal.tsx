import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AdminAccountCreatedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminAccountCreatedModal({
  isOpen,
  onClose,
}: AdminAccountCreatedModalProps) {
  const navigate = useNavigate();

  const handleContinue = () => {
    onClose();
    navigate('/admin/login');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleContinue}
          />

          <motion.div
            className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-white p-8 text-center shadow-2xl"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
          >
            <div className="mb-6 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#eafaf1]">
                <CheckCircle2 size={40} className="text-[#27ae60]" />
              </div>
            </div>

            <h2 className="mb-2 text-[24px] font-bold text-[#333]">
              Admin Account Created
            </h2>
            
            <p className="mb-8 text-[15px] leading-relaxed text-[#666]">
              Your administrator account has been successfully created.
            </p>

            <button
              onClick={handleContinue}
              className="w-full rounded-xl bg-[#1CA698] py-3.5 text-[15px] font-bold text-white shadow-lg shadow-[#1CA698]/20 transition-all hover:bg-[#178f83] hover:shadow-[#1CA698]/30"
            >
              Continue to Login
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
