import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';
import { useTravel } from '../../providers/TravelProvider';
import type { RecommendationNotification } from '@/types/realtime.types';

interface RealtimeRecommendationToastProps {
  notification: RecommendationNotification | null;
  onClose: () => void;
}

export default function RealtimeRecommendationToast({
  notification,
  onClose,
}: RealtimeRecommendationToastProps) {
  const { addActivity } = useTravel();
  const [isAdded, setIsAdded] = useState(false);

  if (!notification) return null;

  const { payload } = notification;

  const handleAddToCalendar = () => {
    addActivity({
      name: payload.activityName,
      date: payload.date,
      time: payload.time,
      location: payload.location,
      category: payload.category,
      notes: payload.details || '',
    });
    setIsAdded(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <AnimatePresence>
      <div className="fixed bottom-6 right-6 z-[200] pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ type: 'spring', bounce: 0.4, duration: 0.6 }}
          className="w-full max-w-[360px] bg-white rounded-2xl shadow-[0_20px_40px_rgb(0,0,0,0.12)] border border-[#f0f2f5] overflow-hidden"
        >
          
          <div className="bg-gradient-to-r from-[#0066D2] to-[#1CA698] px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-white">
              <Sparkles size={16} className="animate-pulse" />
              <span className="text-[14px] font-bold tracking-wide uppercase">New Recommendation</span>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors bg-transparent border-none cursor-pointer p-1"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

         
          <div className="p-5 flex flex-col gap-3">
            {payload.imageUrl && (
              <div className="w-full h-[120px] rounded-xl overflow-hidden mb-1">
                <img src={payload.imageUrl} alt={payload.activityName} className="w-full h-full object-cover" />
              </div>
            )}
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="px-2 py-0.5 bg-[#eafaf1] text-[#27ae60] text-[11px] font-bold rounded-full uppercase tracking-wider">
                  {payload.category}
                </span>
              </div>
              <h3 className="text-[18px] font-bold text-[#333] leading-tight">
                {payload.activityName}
              </h3>
              <p className="text-[13px] text-[#666] flex items-center gap-1.5 mt-1.5 font-medium">
                <MapPin size={14} className="text-[#1CA698]" />
                {payload.location}, {payload.country}
              </p>
            </div>

            {payload.details && (
              <p className="text-[13px] text-[#555] line-clamp-2 leading-relaxed">
                {payload.details}
              </p>
            )}

           
            <div className="flex items-center gap-2 mt-2 pt-3 border-t border-[#f0f2f5]">
              <button 
                onClick={onClose}
                className="flex-1 px-3 py-2.5 rounded-lg bg-[#F5F7FA] text-[#333] text-[13px] font-bold border-none cursor-pointer hover:bg-[#e4e9f0] transition-colors"
              >
                View details
              </button>
              <button 
                onClick={handleAddToCalendar}
                disabled={isAdded}
                className={`flex-1 px-3 py-2.5 rounded-lg text-white text-[13px] font-bold flex items-center justify-center gap-1.5 border-none cursor-pointer transition-all ${
                  isAdded 
                    ? 'bg-[#27ae60] cursor-default' 
                    : 'bg-[#0066D2] hover:bg-[#0055b0] hover:shadow-md'
                }`}
              >
                {isAdded ? (
                  <>
                    <CheckCircle2 size={14} />
                    Added to calendar
                  </>
                ) : (
                  <>
                    <Calendar size={14} />
                    Add to calendar
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
