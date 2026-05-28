import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ShieldAlert, KeyRound } from 'lucide-react';
import { useAuth } from '../../context/AuthProvider';
import FormField from '../../components/FormField/FormField';
import SubmitButton from '../../components/SubmitButton/SubmitButton';

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

  const handleRegister = async (e: { preventDefault(): void }) => {
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
    <div className="flex h-screen w-screen" id="admin-register-page">
      <div className="hidden md:block w-1/2 h-full">
        <img
          src="/banner-tripsync.svg"
          alt="TripSync Banner"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex w-full md:w-1/2 items-center justify-center bg-white px-6 py-12 overflow-y-auto">
        <div className="w-full max-w-[400px]">
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1CA698]/10 text-[#1CA698] text-[13px] font-bold uppercase tracking-wide">
              <ShieldAlert size={16} />
              Restricted administrative access
            </div>
          </div>

          <div className="text-center mb-8">
            <h2
              className="text-[36px] md:text-[48px] font-bold text-[#0066D2] mb-2"
              id="admin-register-heading"
            >
              Create Admin Account
            </h2>
            <p className="text-[16px] text-[#666]">
              Register a new administrative account.
            </p>
          </div>

          <form onSubmit={handleRegister} className="flex flex-col gap-5">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-[14px] text-center font-medium">
                {error}
              </div>
            )}

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
                onChange={(e) => {
                  setAccessCode(e.target.value);
                  setError('');
                }}
                placeholder="Enter access code"
                required
                className="flex-1 h-full bg-transparent text-[20px] leading-[36px] text-[#1CA698] outline-none placeholder:text-[16px]"
              />
            </FormField>

            <SubmitButton disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </SubmitButton>
          </form>

          <p className="mt-6 text-center text-[16px] text-[#171717]">
            Already have an admin account?{' '}
            <Link
              to="/admin/login"
              className="font-semibold text-[#1CA698] hover:underline"
              id="admin-register-login-link"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;
