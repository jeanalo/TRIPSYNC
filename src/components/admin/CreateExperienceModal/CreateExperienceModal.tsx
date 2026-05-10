import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronDown, Search, Image as ImageIcon, Loader2 } from 'lucide-react';
import type { CreateExperienceFormData, SelectOption, UnsplashImage } from '@/types/admin.types';
import { searchUnsplashImages } from '@/services/unsplash.service';
import { socketService } from '@/services/socket.service';

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
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateExperienceFormData>();

  const [imageQuery, setImageQuery] = useState('');
  const [imageResults, setImageResults] = useState<UnsplashImage[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const selectedImageUrl = watch('imageUrl');

  const handleImageSearch = async () => {
    if (!imageQuery.trim()) return;
    setIsSearching(true);
    try {
      const results = await searchUnsplashImages(imageQuery);
      setImageResults(results);
    } catch (error) {
      console.error('Search failed', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectImage = (url: string) => {
    setValue('imageUrl', url);
  };

  
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

  const handleSendRecommendation = (data: CreateExperienceFormData) => {
    socketService.connect();
    socketService.sendAdminRecommendation(data.city, {
      id: Math.random().toString(36).substring(7),
      city: data.city,
      category: data.category,
      activityName: data.activityName,
      location: data.location,
      date: data.date,
      time: data.time,
      details: data.details,
      imageUrl: data.imageUrl,
    });
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
            className="relative z-10 w-full max-w-[480px] max-h-[90vh] rounded-2xl bg-white shadow-2xl flex flex-col overflow-hidden"
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
              className="flex-1 flex flex-col min-h-0"
            >
              <div className="flex-1 overflow-y-auto px-7 py-2 flex flex-col gap-3.5 custom-scrollbar">
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

             
              <div className="flex flex-col gap-3 p-4 rounded-xl border border-[#daa520]/30 bg-[#F5F7FA]/50">
                <label className="text-[13px] font-semibold text-[#0066D2] flex items-center gap-2">
                  <ImageIcon size={16} /> Select Experience Image
                </label>
                
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={imageQuery}
                      onChange={(e) => setImageQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleImageSearch())}
                      placeholder="Search Unsplash (e.g. Paris, Beach)"
                      className={`${inputClasses} py-2 text-[13px]`}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleImageSearch}
                    disabled={isSearching}
                    className="bg-[#0066D2] text-white px-3 rounded-lg hover:bg-[#0055b0] disabled:opacity-50 transition-colors"
                  >
                    {isSearching ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
                  </button>
                </div>

                {imageResults.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-1 max-h-[180px] overflow-y-auto pr-1 custom-scrollbar">
                    {imageResults.map((img) => (
                      <button
                        key={img.id}
                        type="button"
                        onClick={() => handleSelectImage(img.url)}
                        className={`relative aspect-square rounded-md overflow-hidden border-2 transition-all ${
                          selectedImageUrl === img.url ? 'border-[#1CA698] scale-95' : 'border-transparent hover:border-[#1CA698]/50'
                        }`}
                      >
                        <img src={img.thumb} alt={img.alt_description} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}

                {selectedImageUrl && (
                  <div className="mt-2">
                    <p className="text-[11px] text-[#1CA698] font-medium mb-1 flex items-center gap-1">
                      Preview:
                    </p>
                    <div className="relative h-[100px] w-full rounded-lg overflow-hidden border border-[#1CA698]/30">
                      <img src={selectedImageUrl} alt="Selected" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setValue('imageUrl', '')}
                        className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
                      >
                      <X size={12} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

              <div className="px-7 pb-7 pt-2 flex flex-col gap-3">
                <button
                  type="submit"
                  className="w-full rounded-xl bg-[#1CA698] px-4 py-3 text-[15px] font-semibold text-white border-none cursor-pointer transition-all duration-200 hover:bg-[#178f83] hover:shadow-md mt-1"
                >
                  Create Experience
                </button>
                <button
                  type="button"
                  onClick={handleSubmit(handleSendRecommendation)}
                  className="w-full rounded-xl bg-[#eafaf1] px-4 py-3 text-[15px] font-semibold text-[#27ae60] border border-[#27ae60] cursor-pointer transition-all duration-200 hover:bg-[#27ae60] hover:text-white hover:shadow-md"
                >
                  Send as Recommendation
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
