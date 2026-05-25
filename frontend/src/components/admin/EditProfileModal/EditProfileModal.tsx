import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Mail, Phone, MapPin, Globe, Clock } from 'lucide-react';
import type { AdminFullProfile } from '@/types/admin.types';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<AdminFullProfile>) => void;
  profile: AdminFullProfile;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  onSave,
  profile,
}: EditProfileModalProps) {
  const [formData, setFormData] = useState({
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    location: profile.location,
    language: profile.preferences.language,
    timezone: profile.preferences.timezone,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      location: formData.location,
      preferences: {
        ...profile.preferences,
        language: formData.language,
        timezone: formData.timezone,
      },
    });
  };

  const inputClasses =
    'w-full rounded-xl border border-[#e0e0e0] bg-white pl-11 pr-4 py-2.5 text-[14px] text-[#333] outline-none transition-all duration-200 focus:border-[#1CA698] focus:ring-2 focus:ring-[#1CA698]/10';

  const labelClasses = 'text-[13px] font-bold text-[#666] mb-1.5 block';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
          >
            <div className="flex items-center justify-between border-b border-[#f0f2f5] px-6 py-4">
              <h2 className="text-[20px] font-bold text-[#333]">Edit Profile</h2>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-[#999] transition-colors hover:bg-[#f5f7fa] hover:text-[#333]"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className={labelClasses}>Full Name</label>
                  <div className="relative">
                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999]" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={inputClasses}
                    />
                  </div>
                </div>

                <div className="md:col-span-1">
                  <label className={labelClasses}>Email Address</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999]" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={inputClasses}
                    />
                  </div>
                </div>

                <div className="md:col-span-1">
                  <label className={labelClasses}>Phone Number</label>
                  <div className="relative">
                    <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999]" />
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={inputClasses}
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className={labelClasses}>Location</label>
                  <div className="relative">
                    <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999]" />
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className={inputClasses}
                    />
                  </div>
                </div>

                <div className="md:col-span-1">
                  <label className={labelClasses}>Language</label>
                  <div className="relative">
                    <Globe size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999]" />
                    <select
                      value={formData.language}
                      onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                      className={`${inputClasses} appearance-none pr-10`}
                    >
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                    </select>
                  </div>
                </div>

                <div className="md:col-span-1">
                  <label className={labelClasses}>Timezone</label>
                  <div className="relative">
                    <Clock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999]" />
                    <select
                      value={formData.timezone}
                      onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                      className={`${inputClasses} appearance-none pr-10`}
                    >
                      <option value="UTC -5 (Colombia)">UTC -5 (Colombia)</option>
                      <option value="UTC +1 (Europe)">UTC +1 (Europe)</option>
                      <option value="UTC -8 (Pacific)">UTC -8 (Pacific)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-xl border border-[#e0e0e0] py-3 text-[14px] font-bold text-[#666] transition-all hover:bg-[#f5f7fa]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-[#1CA698] py-3 text-[14px] font-bold text-white shadow-lg shadow-[#1CA698]/20 transition-all hover:bg-[#178f83] hover:shadow-[#1CA698]/30"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
