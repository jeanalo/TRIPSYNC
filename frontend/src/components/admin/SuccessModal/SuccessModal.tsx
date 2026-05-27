import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

export default function SuccessModal({
  isOpen,
  onClose,
  title = 'Experience Sent',
  message = 'The activity will be visible to all travelers',
}: SuccessModalProps) {
  
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          
          <motion.div
            className="absolute inset-0 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

        
          <motion.div
            className="relative z-10 w-full max-w-[360px] rounded-2xl bg-white p-8 shadow-2xl text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25 }}
          >
            
            <div className="flex items-center justify-center mx-auto mb-5 h-[64px] w-[64px] rounded-full bg-[#FFF3CD]">
              <AlertTriangle size={32} className="text-[#F5A623]" />
            </div>

           
            <h3 className="text-[20px] font-bold text-[#333] mb-2">
              {title}
            </h3>

           
            <p className="text-[14px] text-[#666] mb-6 leading-relaxed">
              {message}
            </p>

           
            <button
              type="button"
              onClick={onClose}
              className="w-full max-w-[200px] rounded-xl bg-[#F5A623] px-6 py-2.5 text-[15px] font-semibold text-white border-none cursor-pointer transition-all duration-200 hover:bg-[#e09515] hover:shadow-md"
            >
              OK
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
