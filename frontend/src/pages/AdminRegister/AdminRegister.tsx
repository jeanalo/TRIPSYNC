import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ShieldAlert, KeyRound } from 'lucide-react';
import { useAuth } from '../../context/AuthProvider';
import FormField from '../../components/FormField/FormField';
import SubmitButton from '../../components/SubmitButton/SubmitButton';
import AuthForm from '../../components/AuthForm/AuthForm';

const ADMIN_ACCESS_CODE = import.meta.env.VITE_ADMIN_ACCESS_CODE ?? 'TRIPSYNC-ADMIN';

const AdminRegister = () => {
  const { registerAdmin } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (accessCode !== ADMIN_ACCESS_CODE) {
      setError('Invalid admin access code.');
      return;
    }

    setIsLoading(true);
    try {
      await registerAdmin(email, name, password);
      navigate('/admin/login');
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'Failed to create admin account. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthForm
      id="admin-register-page"
      heading="Create Admin Account"
      headingId="admin-register-heading"
      subtitle="Register a new administrative account."
      badge={
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1CA698]/10 text-[#1CA698] text-[13px] font-bold uppercase tracking-wide">
          <ShieldAlert size={16} />
          Restricted administrative access
        </div>
      }
      onSubmit={handleRegister}
      error={error}
      footer={
        <>
          Already have an admin account?{' '}
          <Link
            to="/admin/login"
            className="font-semibold text-[#1CA698] hover:underline"
            id="admin-register-login-link"
          >
            Sign In
          </Link>
        </>
      }
    >
      <FormField label="Full Name" icon={<User size={24} />}>
        <input
          id="admin-register-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Juanita Pérez"
          required
          className="flex-1 h-full bg-transparent text-[20px] leading-[36px] text-[#1CA698] outline-none"
        />
      </FormField>

      <FormField label="Email Address" icon={<Mail size={24} />}>
        <input
          id="admin-register-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="juanita@gmail.com"
          required
          className="flex-1 h-full bg-transparent text-[20px] leading-[36px] text-[#1CA698] outline-none"
        />
      </FormField>

      <FormField label="Password" icon={<Lock size={24} />}>
        <input
          id="admin-register-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          className="flex-1 h-full bg-transparent text-[20px] leading-[36px] text-[#1CA698] outline-none"
        />
      </FormField>

      <FormField label="Confirm Password" icon={<Lock size={24} />}>
        <input
          id="admin-register-confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          required
          className="flex-1 h-full bg-transparent text-[20px] leading-[36px] text-[#1CA698] outline-none"
        />
      </FormField>

      <FormField label="Admin Access Code" icon={<KeyRound size={24} />}>
        <input
          id="admin-register-code"
          type="text"
          value={accessCode}
          onChange={(e) => { setAccessCode(e.target.value); setError(''); }}
          placeholder="Enter access code"
          required
          className="flex-1 h-full bg-transparent text-[20px] leading-[36px] text-[#1CA698] outline-none placeholder:text-[16px]"
        />
      </FormField>

      <SubmitButton disabled={isLoading}>
        {isLoading ? 'Creating Account...' : 'Sign Up'}
      </SubmitButton>
    </AuthForm>
  );
};

export default AdminRegister;
