import { useEffect, useState, useRef, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronDown, Search, Image as ImageIcon, Loader2 } from 'lucide-react';
import type { CreateExperienceFormData, SelectOption, UnsplashImage } from '@/types/admin.types';
import { searchUnsplashImages } from '@/services/unsplash.service';
import { useCountries } from '@/hooks/useCountries';

interface CreateExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateExperienceFormData) => void | Promise<void>;
  categoryOptions: SelectOption[];
  isSubmitting?: boolean;
  submitError?: string | null;
}

const DIFFICULTY_OPTIONS = ['Easy', 'Moderate', 'Challenging'] as const;

export default function CreateExperienceModal({
  isOpen,
  onClose,
  onSubmit,
  categoryOptions,
  isSubmitting = false,
  submitError = null,
}: CreateExperienceModalProps) {
  const { countries, loading: loadingCountries } = useCountries();
  const { register, handleSubmit, reset, setValue, watch } = useForm<CreateExperienceFormData>();

  const [countrySearch, setCountrySearch] = useState('');
  const [countryOpen, setCountryOpen] = useState(false);
  const countryRef = useRef<HTMLDivElement>(null);

  const filteredCountries = useMemo(() => {
    const q = countrySearch.toLowerCase();
    return q ? countries.filter((c) => c.name.toLowerCase().includes(q)) : countries;
  }, [countries, countrySearch]);

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

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!countryRef.current?.contains(e.target as Node)) setCountryOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (isOpen) {
      reset();
      setImageQuery('');
      setImageResults([]);
      setCountrySearch('');
      setCountryOpen(false);
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

  const selectClasses =
    'w-full appearance-none rounded-lg border border-[#0066D2]/30 bg-white px-4 py-3 text-[14px] text-[#333] outline-none transition-colors duration-200 focus:border-[#0066D2] focus:ring-1 focus:ring-[#0066D2]/30 cursor-pointer';

  const inputClasses =
    'w-full rounded-lg border border-[#0066D2]/30 bg-white px-4 py-3 text-[14px] text-[#333] outline-none transition-colors duration-200 focus:border-[#0066D2] focus:ring-1 focus:ring-[#0066D2]/30';

  const textareaClasses = `${inputClasses} resize-none min-h-[72px]`;

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
              <h2 className="text-[22px] font-bold text-[#0066D2]">Create Experience</h2>
              <button
                type="button"
                onClick={onClose}
                className="p-1 bg-transparent border-none cursor-pointer text-[#999] hover:text-[#333] transition-colors"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 overflow-y-auto px-7 py-2 flex flex-col gap-3.5 custom-scrollbar">
                <input
                  type="text"
                  {...register('name', { required: true })}
                  className={inputClasses}
                  placeholder="Experience name"
                />

                <input type="hidden" {...register('country', { required: true })} />
                <div ref={countryRef} className="relative">
                  <input
                    type="text"
                    value={countrySearch}
                    onFocus={() => { setCountryOpen(true); setCountrySearch(''); }}
                    onChange={(e) => {
                      setCountrySearch(e.target.value);
                      setCountryOpen(true);
                      if (!e.target.value) setValue('country', '');
                    }}
                    placeholder={loadingCountries ? 'Loading countries…' : 'Country'}
                    disabled={loadingCountries}
                    className={inputClasses}
                  />
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999] pointer-events-none" />
                  {countryOpen && (
                    <div className="absolute left-0 top-full z-50 mt-1 max-h-[220px] w-full overflow-y-auto rounded-xl border border-[#0066D2]/30 bg-white shadow-lg custom-scrollbar">
                      {loadingCountries ? (
                        <p className="p-3 text-center text-[14px] text-[#999]">Loading...</p>
                      ) : filteredCountries.length === 0 ? (
                        <p className="p-3 text-center text-[14px] text-[#999]">No results</p>
                      ) : filteredCountries.map((c) => (
                        <button
                          key={c.name}
                          type="button"
                          onClick={() => {
                            setValue('country', c.name, { shouldValidate: true });
                            setCountrySearch(c.name);
                            setCountryOpen(false);
                          }}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-[#0066D2]/10"
                        >
                          <span className="text-lg">{c.flag}</span>
                          <span className="text-[14px] text-gray-800">{c.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <input
                  type="text"
                  {...register('location', { required: true })}
                  className={inputClasses}
                  placeholder="Location (e.g. Krabi Bay)"
                />

                <div className="relative">
                  <select {...register('category', { required: true })} className={selectClasses}>
                    <option value="">Category</option>
                    {categoryOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999] pointer-events-none" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    {...register('duration', { required: true })}
                    className={inputClasses}
                    placeholder="Duration (e.g. 3 hours)"
                  />
                  <div className="relative">
                    <select {...register('difficulty', { required: true })} className={selectClasses}>
                      <option value="">Difficulty</option>
                      {DIFFICULTY_OPTIONS.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999] pointer-events-none" />
                  </div>
                </div>

                <textarea {...register('description', { required: true })} className={textareaClasses} placeholder="Description" rows={3} />
                <textarea {...register('eco')} className={textareaClasses} placeholder="Eco note (optional)" rows={2} />
                <textarea {...register('highlights')} className={textareaClasses} placeholder="Highlights — one per line (e.g. Sea cave exploration)" rows={3} />
                <textarea {...register('included')} className={textareaClasses} placeholder="What's included — one item per line" rows={3} />
                <textarea {...register('tips')} className={textareaClasses} placeholder="Traveler tips — one per line" rows={3} />

                <div className="flex flex-col gap-3 p-4 rounded-xl border border-[#0066D2]/30 bg-[#F5F7FA]/50">
                  <label className="text-[13px] font-semibold text-[#0066D2] flex items-center gap-2">
                    <ImageIcon size={16} /> Select Experience Image
                  </label>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={imageQuery}
                      onChange={(e) => setImageQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleImageSearch())}
                      placeholder="Search Unsplash (e.g. Paris, Beach)"
                      className={`${inputClasses} py-2 text-[13px]`}
                    />
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
                          onClick={() => setValue('imageUrl', img.url)}
                          className={`relative aspect-square rounded-md overflow-hidden border-2 transition-all ${
                            selectedImageUrl === img.url
                              ? 'border-[#0066D2] scale-95'
                              : 'border-transparent hover:border-[#0066D2]/50'
                          }`}
                        >
                          <img src={img.thumb} alt={img.alt_description} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}

                  {selectedImageUrl && (
                    <div className="mt-2">
                      <p className="text-[11px] text-[#0066D2] font-medium mb-1">Preview:</p>
                      <div className="relative h-[100px] w-full rounded-lg overflow-hidden border border-[#0066D2]/30">
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

              <div className="px-7 pb-7 pt-2 flex flex-col gap-2">
                {submitError && (
                  <p className="text-[13px] text-red-500 text-center">{submitError}</p>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-xl bg-[#0066D2] px-4 py-3 text-[15px] font-semibold text-white border-none cursor-pointer transition-all duration-200 hover:bg-[#0055b0] hover:shadow-md mt-1 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <><Loader2 size={18} className="animate-spin" />Creating...</>
                  ) : (
                    'Create Experience'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}