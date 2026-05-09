import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronDown } from 'lucide-react';
import type { CreateExperienceFormData, SelectOption } from '@/types/admin.types';

interface CreateExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateExperienceFormData) => void;
  countryOptions: SelectOption[];
  cityOptions: SelectOption[];
  categoryOptions: SelectOption[];
}

export default function CreateExperienceModal({
  isOpen,
  onClose,
  onSubmit,
  countryOptions,
  cityOptions,
  categoryOptions,
}: CreateExperienceModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateExperienceFormData>();

  
  useEffect(() => {
    if (isOpen) {
      reset();
    }
  }, [isOpen, reset]);

     
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

  const handleFormSubmit = (data: CreateExperienceFormData) => {
    onSubmit(data);
  };

  const selectClasses =
    'w-full appearance-none rounded-lg border border-[#daa520] bg-white px-4 py-3 text-[14px] text-[#333] outline-none transition-colors duration-200 focus:border-[#1CA698] focus:ring-1 focus:ring-[#1CA698]/30 cursor-pointer';

  const inputClasses =
    'w-full rounded-lg border border-[#daa520] bg-white px-4 py-3 text-[14px] text-[#333] outline-none transition-colors duration-200 focus:border-[#1CA698] focus:ring-1 focus:ring-[#1CA698]/30';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
         
          <motion.div
            className="absolute inset-0 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

        
          <motion.div
            className="relative z-10 w-full max-w-[480px] rounded-2xl bg-white shadow-2xl"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25 }}
          >
            
            <div className="flex items-center justify-between px-7 pt-6 pb-4">
              <h2 className="text-[22px] font-bold text-[#0066D2]">
                Create Experience
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="p-1 bg-transparent border-none cursor-pointer text-[#999] hover:text-[#333] transition-colors"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit(handleFormSubmit)}
              className="flex flex-col gap-3.5 px-7 pb-7"
            >
              
              <div className="relative">
                <select
                  id="create-exp-country"
                  {...register('country', { required: true })}
                  className={selectClasses}
                >
                  <option value="">Country</option>
                  {countryOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999] pointer-events-none"
                />
              </div>

             
              <div className="relative">
                <select
                  id="create-exp-city"
                  {...register('city', { required: true })}
                  className={selectClasses}
                >
                  <option value="">City</option>
                  {cityOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999] pointer-events-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input
                  id="create-exp-date"
                  type="date"
                  {...register('date', { required: true })}
                  className={inputClasses}
                  placeholder="Date"
                />
                <input
                  id="create-exp-time"
                  type="time"
                  {...register('time', { required: true })}
                  className={inputClasses}
                  placeholder="Time"
                />
              </div>

             
              <input
                id="create-exp-activity"
                type="text"
                {...register('activityName', { required: true })}
                className={inputClasses}
                placeholder="Activity Name"
              />

              
              <input
                id="create-exp-location"
                type="text"
                {...register('location', { required: true })}
                className={inputClasses}
                placeholder="Location"
              />

             
              <div className="relative">
                <select
                  id="create-exp-category"
                  {...register('category', { required: true })}
                  className={selectClasses}
                >
                  <option value="">Category</option>
                  {categoryOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999] pointer-events-none"
                />
              </div>

             
              <textarea
                id="create-exp-details"
                {...register('details')}
                className={`${inputClasses} resize-none min-h-[80px]`}
                placeholder="Details"
                rows={3}
              />

              
              <button
                type="submit"
                className="w-full rounded-xl bg-[#1CA698] px-4 py-3 text-[15px] font-semibold text-white border-none cursor-pointer transition-all duration-200 hover:bg-[#178f83] hover:shadow-md mt-1"
              >
                Create Experience
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
