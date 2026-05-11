import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ShieldAlert, KeyRound } from 'lucide-react';
import { useAuth } from '../../providers/AuthProvider';
import FormField from '../../components/FormField/FormField';
import SubmitButton from '../../components/SubmitButton/SubmitButton';

const ADMIN_ACCESS_CODE = import.meta.env.VITE_ADMIN_ACCESS_CODE ?? 'TRIPSYNC-ADMIN';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { loginAdmin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: { preventDefault(): void }) => {
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
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión como administrador.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen" id="admin-login-page">

      <div className="hidden md:block w-1/2 h-full">
        <img
          src="/banner-tripsync.svg"
          alt="TripSync Banner"
          className="w-full h-full object-cover"
        />
      </div>


      <div className="flex w-full md:w-1/2 items-center justify-center bg-white px-6">
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
              id="admin-login-heading"
            >
              Admin Sign In
            </h2>
            <p className="text-[16px] text-[#666]">
              Access the TripSync administration panel.
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-[14px] text-center font-medium">
                {error}
              </div>
            )}

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
          </form>

          <p className="mt-6 text-center text-[16px] text-[#171717]">
            Need a new admin account?{' '}
            <Link
              to="/admin/register"
              className="font-semibold text-[#1CA698] hover:underline"
              id="admin-login-register-link"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
