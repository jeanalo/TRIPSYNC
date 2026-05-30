import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ShieldAlert, KeyRound } from 'lucide-react';
import { useAuth } from '../../context/AuthProvider';
import FormField from '../../components/FormField/FormField';
import SubmitButton from '../../components/SubmitButton/SubmitButton';
import AuthForm from '../../components/AuthForm/AuthForm';

const ADMIN_ACCESS_CODE = import.meta.env.VITE_ADMIN_ACCESS_CODE ?? 'TRIPSYNC-ADMIN';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { loginAdmin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (accessCode !== ADMIN_ACCESS_CODE) {
      setError('Invalid admin access code.');
      return;
    }

    setIsLoading(true);
    try {
      await loginAdmin(email, password);
      navigate('/admin');
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'Admin login failed. Please check your credentials.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthForm
      id="admin-login-page"
      heading="Admin Sign In"
      headingId="admin-login-heading"
      subtitle="Access the TripSync administration panel."
      badge={
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1CA698]/10 text-[#1CA698] text-[13px] font-bold uppercase tracking-wide">
          <ShieldAlert size={16} />
          Restricted administrative access
        </div>
      }
      onSubmit={handleLogin}
      error={error}
      footer={
        <>
          Need a new admin account?{' '}
          <Link
            to="/admin/register"
            className="font-semibold text-[#1CA698] hover:underline"
            id="admin-login-register-link"
          >
            Register here
          </Link>
        </>
      }
    >
      <FormField label="Email Address" icon={<Mail size={24} />}>
        <input
          id="admin-login-email"
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError(''); }}
          placeholder="juanita@gmail.com"
          required
          className="flex-1 h-full bg-transparent text-[20px] leading-[36px] text-[#1CA698] outline-none"
        />
      </FormField>

      <FormField label="Password" icon={<Lock size={24} />}>
        <input
          id="admin-login-password"
          type="password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError(''); }}
          placeholder="••••••••"
          required
          className="flex-1 h-full bg-transparent text-[20px] leading-[36px] text-[#1CA698] outline-none"
        />
      </FormField>

      <FormField label="Admin Access Code" icon={<KeyRound size={24} />}>
        <input
          id="admin-login-code"
          type="password"
          value={accessCode}
          onChange={(e) => { setAccessCode(e.target.value); setError(''); }}
          placeholder="Enter access code"
          required
          className="flex-1 h-full bg-transparent text-[20px] leading-[36px] text-[#1CA698] outline-none placeholder:text-[16px]"
        />
      </FormField>

      <SubmitButton disabled={isLoading}>
        {isLoading ? 'Signing In...' : 'Sign In'}
      </SubmitButton>
    </AuthForm>
  );
};

export default AdminLogin;
