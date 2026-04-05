import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useTravel } from '../../context/TravelContext';
import PageHeader from '../../components/ui/PageHeader';
import ActionButton from '../../components/ui/ActionButton';

const Profile = () => {
  const { user, logout } = useTravel();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    navigate('/');
  };

  return (
    <div>
      <PageHeader
        title="My Profile"
        subtitle="Manage your account and preferences"
        action={
          <ActionButton icon={<LogOut size={24} />} onClick={handleSignOut}>
            Sign Out
          </ActionButton>
        }
      />
    </div>
  );
};

export default Profile;
