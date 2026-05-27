import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, Sparkles } from 'lucide-react';
import type { RecommendationNotification } from '@/types/realtime.types';

interface RealtimeRecommendationModalProps {
  notification: RecommendationNotification | null;
  onClose: () => void;
}

export default function RealtimeRecommendationModal({
  notification,
  onClose,
}: RealtimeRecommendationModalProps) {
  const navigate = useNavigate();

  if (!notification) return null;

  const { payload } = notification;

  const handleViewMore = () => {
    onClose();
    navigate(`/app/experiences/${payload.id}`);
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          className="absolute inset-0 bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        <motion.div
          className="relative w-full max-w-[420px] bg-white rounded-2xl shadow-2xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', bounce: 0.3, duration: 0.5 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-gradient-to-r from-[#0066D2] to-[#1CA698] px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-white">
              <Sparkles size={17} className="animate-pulse" />
              <span className="text-[13px] font-bold tracking-widest uppercase">
                New Recommendation
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors bg-transparent border-none cursor-pointer p-1 rounded-full"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          {payload.imageUrl && (
            <div className="w-full h-[180px] overflow-hidden">
              <img
                src={payload.imageUrl}
                alt={payload.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-5 flex flex-col gap-3">
            <div>
              <span className="px-2.5 py-0.5 bg-[#eafaf1] text-[#27ae60] text-[11px] font-bold rounded-full uppercase tracking-wider">
                {payload.category}
              </span>
              <h3 className="mt-2 text-[20px] font-bold text-[#1a1a1a] leading-tight">
                {payload.name}
              </h3>
              <p className="flex items-center gap-1.5 mt-1.5 text-[13px] text-[#666] font-medium">
                <MapPin size={14} className="text-[#1CA698] shrink-0" />
                {payload.location}, {payload.country}
              </p>
            </div>

            {payload.description && (
              <p className="text-[13px] text-[#555] line-clamp-3 leading-relaxed">
                {payload.description}
              </p>
            )}

            <div className="flex items-center gap-3 mt-1 pt-4 border-t border-[#f0f2f5]">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-[#f5f7fa] text-[#555] text-[13px] font-semibold border-none cursor-pointer hover:bg-[#e8ecf2] transition-colors"
              >
                Dismiss
              </button>
              <button
                onClick={handleViewMore}
                className="flex-1 py-2.5 rounded-xl bg-[#0066D2] text-white text-[13px] font-semibold border-none cursor-pointer hover:bg-[#0055b0] transition-colors shadow-sm"
              >
                Ver más
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
