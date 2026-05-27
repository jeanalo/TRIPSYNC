import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, Leaf, Sparkles } from 'lucide-react';
import type { RecommendationNotification } from '@/types/realtime.types';
import IconBadge from '../IconBadge/IconBadge';

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
          className="relative w-full max-w-[420px] bg-white rounded-2xl shadow-xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', bounce: 0.3, duration: 0.5 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-5 py-4 flex items-center justify-between border-b border-[#0066D2]/10">
            <div className="flex items-center gap-3">
              <IconBadge color="blue" size="md">
                <Sparkles size={18} />
              </IconBadge>
              <span className="text-[15px] font-bold text-[#0066D2]">
                Nueva recomendación
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors bg-transparent border-none cursor-pointer p-1"
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
              <div className="flex items-center gap-1.5">
                <Leaf size={14} className="text-[#F2B705] shrink-0" />
                <span className="text-[13px] font-semibold text-[#0066D2]/70">
                  {payload.category}
                </span>
              </div>
              <h3 className="mt-2 text-[20px] font-bold text-[#0066D2] leading-tight">
                {payload.name}
              </h3>
              <p className="flex items-center gap-1.5 mt-1.5 text-[13px] text-[#0066D2]/60 font-medium">
                <MapPin size={14} className="text-[#1CA698] shrink-0" />
                {payload.location}, {payload.country}
              </p>
            </div>

            {payload.description && (
              <p className="text-[13px] text-[#0066D2]/60 line-clamp-3 leading-relaxed">
                {payload.description}
              </p>
            )}

            <div className="flex items-center gap-3 mt-1 pt-4 border-t border-[#0066D2]/10">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-[#0066D2]/5 text-[#0066D2] text-[13px] font-semibold border border-[#0066D2]/20 cursor-pointer hover:bg-[#0066D2]/10 transition-colors"
              >
                Descartar
              </button>
              <button
                onClick={handleViewMore}
                className="flex-1 py-2.5 rounded-xl bg-[#0066D2] text-white text-[13px] font-semibold border-none cursor-pointer hover:opacity-90 transition-opacity"
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
