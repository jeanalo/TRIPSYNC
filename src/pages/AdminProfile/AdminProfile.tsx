import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  User, 
  Mail, 
  Shield, 
  Settings, 
  Activity, 
  MapPin, 
  Phone, 
  Calendar, 
  Lock, 
  Smartphone, 
  Edit2, 
  LogOut 
} from 'lucide-react';
import { mockAdminFullProfile, mockAdminAccountActivity } from '@/services/admin.mock';
import EditProfileModal from '@/components/admin/EditProfileModal/EditProfileModal';
import ProfileUpdatedModal from '@/components/admin/ProfileUpdatedModal/ProfileUpdatedModal';
import type { AdminFullProfile } from '@/types/admin.types';
import { useAuth } from '@/providers/AuthProvider';

export default function AdminProfile() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [profile, setProfile] = useState<AdminFullProfile>(mockAdminFullProfile);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdateSuccessOpen, setIsUpdateSuccessOpen] = useState(false);
  
  const activities = mockAdminAccountActivity;

  const handleSaveProfile = (updatedData: Partial<AdminFullProfile>) => {
    setProfile(prev => ({
      ...prev,
      ...updatedData,
      preferences: {
        ...prev.preferences,
        ...(updatedData.preferences || {})
      }
    }));
    setIsEditModalOpen(false);
    setIsUpdateSuccessOpen(true);
  };

  const handleSignOut = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex flex-col">
      
      <motion.div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-7"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-[26px] font-bold text-[#0066D2] leading-tight">
            Admin Profile
          </h1>
          <p className="text-[14px] text-[#0066D2]/60 mt-1">
            Manage administrator account information and preferences
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-[#1CA698] px-5 py-2.5 text-[14px] font-semibold text-white border-none cursor-pointer transition-all duration-200 hover:bg-[#178f83] hover:shadow-lg shrink-0"
          >
            <Edit2 size={18} strokeWidth={2.5} />
            Edit Profile
          </button>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 rounded-xl bg-white border border-[#e0e0e0] px-5 py-2.5 text-[14px] font-semibold text-[#E53935] cursor-pointer transition-all duration-200 hover:bg-[#fdeaea] hover:border-[#E53935]/30 hover:shadow-sm shrink-0"
          >
            <LogOut size={18} strokeWidth={2.5} />
            Sign Out
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-1 flex flex-col gap-6">
          
          <div className="bg-white rounded-3xl p-6 border border-[#e0e0e0] shadow-sm flex flex-col items-center text-center">
            <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-[#1CA698]/10 mb-4">
              <img src={profile.avatar} alt={profile.name} className="h-full w-full object-cover" />
            </div>
            <h2 className="text-[20px] font-bold text-[#333]">{profile.name}</h2>
            <p className="text-[14px] text-[#666] mb-3">{profile.email}</p>
            <div className="flex flex-col gap-2 w-full">
              <span className="px-3 py-1 bg-[#ebf5ff] text-[#0066D2] text-[12px] font-bold rounded-full uppercase tracking-wider">
                {profile.role}
              </span>
              <span className="px-3 py-1 bg-[#eafaf1] text-[#27ae60] text-[12px] font-bold rounded-full uppercase tracking-wider">
                Status: {profile.status}
              </span>
            </div>
          </div>

          
          <div className="bg-white rounded-3xl p-6 border border-[#e0e0e0] shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Activity size={20} className="text-[#1CA698]" />
              <h3 className="text-[18px] font-bold text-[#333]">Recent Activity</h3>
            </div>
            <div className="flex flex-col gap-4">
              {activities.map((act) => (
                <div key={act.id} className="flex flex-col gap-1 pb-3 border-b border-[#f0f2f5] last:border-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <span className="text-[14px] font-bold text-[#333]">{act.action}</span>
                    <span className={`h-2 w-2 rounded-full mt-1.5 ${
                      act.status === 'success' ? 'bg-[#27ae60]' : 
                      act.status === 'info' ? 'bg-[#0066D2]' : 'bg-[#f1c40f]'
                    }`} />
                  </div>
                  <div className="flex justify-between text-[12px] text-[#999]">
                    <span>{act.section}</span>
                    <span>{act.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          <div className="bg-white rounded-3xl p-6 border border-[#e0e0e0] shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <User size={20} className="text-[#1CA698]" />
              <h3 className="text-[18px] font-bold text-[#333]">Account Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoItem icon={<User size={16} />} label="Full Name" value={profile.name} />
              <InfoItem icon={<Mail size={16} />} label="Email Address" value={profile.email} />
              <InfoItem icon={<Shield size={16} />} label="Role" value={profile.role} />
              <InfoItem icon={<Phone size={16} />} label="Phone Number" value={profile.phone} />
              <InfoItem icon={<MapPin size={16} />} label="Location" value={profile.location} />
              <InfoItem icon={<Calendar size={16} />} label="Joined Date" value={profile.joinedDate} />
            </div>
          </div>

          
          <div className="bg-white rounded-3xl p-6 border border-[#e0e0e0] shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Settings size={20} className="text-[#1CA698]" />
              <h3 className="text-[18px] font-bold text-[#333]">Preferences</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoItem label="Language" value={profile.preferences.language} />
              <InfoItem label="Timezone" value={profile.preferences.timezone} />
              <InfoItem label="Email Notifications" value={profile.preferences.emailNotifications ? 'Enabled' : 'Disabled'} />
              <InfoItem label="Dashboard View" value={profile.preferences.dashboardView.charAt(0).toUpperCase() + profile.preferences.dashboardView.slice(1)} />
            </div>
          </div>

          
          <div className="bg-white rounded-3xl p-6 border border-[#e0e0e0] shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Lock size={20} className="text-[#1CA698]" />
              <h3 className="text-[18px] font-bold text-[#333]">Security</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoItem icon={<Lock size={16} />} label="Password Status" value={profile.security.passwordStatus} />
              <InfoItem icon={<Smartphone size={16} />} label="Two-Factor Auth" value={profile.security.twoFactorEnabled ? 'Active' : 'Inactive'} />
              <InfoItem icon={<Activity size={16} />} label="Last Login" value={profile.security.lastLogin} />
            </div>
          </div>
        </div>
      </div>

      
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveProfile}
        profile={profile}
      />

      <ProfileUpdatedModal
        isOpen={isUpdateSuccessOpen}
        onClose={() => setIsUpdateSuccessOpen(false)}
      />
    </div>
  );
}

function InfoItem({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[12px] font-bold text-[#999] uppercase tracking-wider">{label}</span>
      <div className="flex items-center gap-2 text-[15px] text-[#333] font-medium">
        {icon && <span className="text-[#1CA698]/60">{icon}</span>}
        <span>{value}</span>
      </div>
    </div>
  );
}
