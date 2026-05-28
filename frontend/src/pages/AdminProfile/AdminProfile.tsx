import { useState } from 'react';
import {
  LogOut,
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Shield,
  Save,
  Settings,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';
import PageHeader from '@/components/PageHeader/PageHeader';
import ActionButton from '@/components/ActionButton/ActionButton';
import FormCard from '@/components/FormCard/FormCard';
import FormField from '@/components/FormField/FormField';
import SubmitButton from '@/components/SubmitButton/SubmitButton';
export default function AdminProfile() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [nameValue, setNameValue] = useState(user?.name ?? '');
  const [passwordValue, setPasswordValue] = useState('');
  const [phoneValue, setPhoneValue] = useState('');
  const [locationValue, setLocationValue] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignOut = () => {
    logout();
    navigate('/');
  };

  const handleEditSave = () => {
    if (isEditing) {
      updateUser(nameValue);
    }
    setIsEditing((prev) => !prev);
  };

  return (
    <div>
      <PageHeader
        title="My Profile"
        subtitle="Manage your admin account and preferences."
        action={
          <ActionButton icon={<LogOut size={24} />} onClick={handleSignOut}>
            Sign Out
          </ActionButton>
        }
      />

      <div className="px-4 lg:px-12">
        <FormCard>
          <div className="flex flex-col gap-[25px]">
            {/* Full Name */}
            <FormField
              label="Full Name"
              icon={<User size={24} />}
              {...(!isEditing && { value: user?.name ?? nameValue })}
            >
              {isEditing && (
                <input
                  className="w-full text-[20px] leading-[36px] text-[#1CA698] outline-none bg-transparent"
                  value={nameValue}
                  onChange={(e) => setNameValue(e.target.value)}
                  autoFocus
                />
              )}
            </FormField>

            {/* Email + Role */}
            <div className="flex flex-col md:flex-row gap-[25px] md:gap-[65px]">
              <div className="flex-1">
                <FormField
                  label="Email Address"
                  icon={<Mail size={24} />}
                  value={user?.email ?? ''}
                />
              </div>
              <div className="flex-1">
                <FormField
                  label="Admin Role"
                  icon={<Shield size={24} />}
                  value={user?.role ?? 'admin'}
                />
              </div>
            </div>

            {/* Phone + Location */}
            <div className="flex flex-col md:flex-row gap-[25px] md:gap-[65px]">
              <div className="flex-1">
                <FormField
                  label="Phone Number"
                  icon={<Phone size={24} />}
                  {...(!isEditing && { value: phoneValue })}
                >
                  {isEditing && (
                    <input
                      className="w-full text-[20px] leading-[36px] text-[#1CA698] outline-none bg-transparent"
                      value={phoneValue}
                      onChange={(e) => setPhoneValue(e.target.value)}
                    />
                  )}
                </FormField>
              </div>
              <div className="flex-1">
                <FormField
                  label="Location"
                  icon={<MapPin size={24} />}
                  {...(!isEditing && { value: locationValue })}
                >
                  {isEditing && (
                    <input
                      className="w-full text-[20px] leading-[36px] text-[#1CA698] outline-none bg-transparent"
                      value={locationValue}
                      onChange={(e) => setLocationValue(e.target.value)}
                    />
                  )}
                </FormField>
              </div>
            </div>

            {/* Password */}
            <FormField
              label="Password"
              icon={<Lock size={20} />}
              {...(!isEditing && { value: '••••••••' })}
            >
              {isEditing && (
                <div className="flex items-center gap-2 w-full">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="w-full text-[20px] leading-[36px] text-[#1CA698] outline-none bg-transparent"
                    value={passwordValue}
                    onChange={(e) => setPasswordValue(e.target.value)}
                    placeholder="New password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="text-[#1CA698] shrink-0 bg-transparent border-none cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              )}
            </FormField>

            <SubmitButton
              type="button"
              icon={isEditing ? <Save size={24} /> : <Settings size={24} />}
              onClick={handleEditSave}
            >
              {isEditing ? 'Save changes' : 'Edit Profile'}
            </SubmitButton>
          </div>
        </FormCard>
      </div>
    </div>
  );
}
