import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Mail, Lock, Settings, Save, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthProvider';
import PageHeader from '../../components/PageHeader/PageHeader';
import ActionButton from '../../components/ActionButton/ActionButton';
import FormCard from '../../components/FormCard/FormCard';
import FormField from '../../components/FormField/FormField';
import SubmitButton from '../../components/SubmitButton/SubmitButton';

const Profile = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [nameValue, setNameValue] = useState(user?.name ?? '');
  const [passwordValue, setPasswordValue] = useState('');
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
        subtitle="Manage your account and preferences."
        action={
          <ActionButton icon={<LogOut size={24} />} onClick={handleSignOut}>
            Sign Out
          </ActionButton>
        }
      />

      <div className="px-4 lg:px-12">
        <FormCard>
          <div className="flex flex-col gap-[25px]">
            <FormField
              label="Full Name"
              icon={<User size={24} />}
              {...(!isEditing && { value: user?.name ?? '—' })}
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

            <div className="flex flex-col md:flex-row gap-[25px] md:gap-[65px]">
              <div className="flex-1">
                <FormField
                  label="Email Address"
                  icon={<Mail size={24} />}
                  value={user?.email ?? '—'}
                />
              </div>
              <div className="flex-1">
                <FormField
                  label="Password"
                  icon={<Lock size={20} />}
                  {...(!isEditing && { value: '••••••••' })}
                >
                  {isEditing && (
                    <div className="flex items-center gap-2">
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
                        className="text-[#1CA698] shrink-0"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  )}
                </FormField>
              </div>
            </div>

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
};

export default Profile;
