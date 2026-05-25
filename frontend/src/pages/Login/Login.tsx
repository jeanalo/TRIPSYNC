import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthProvider';
import FormField from '../../components/FormField/FormField';
import SubmitButton from '../../components/SubmitButton/SubmitButton';

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      navigate(searchParams.get('redirect') ?? '/app');
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Error al iniciar sesión. Verifica tus credenciales.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen" id="login-page">
      <div className="hidden md:block w-1/2 h-full">
        <img
          src="/banner-tripsync.svg"
          alt="TripSync Banner"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex w-full md:w-1/2 items-center justify-center bg-white px-6">
        <div className="w-full max-w-[400px]">
          <h2
            className="text-center text-[36px] md:text-[48px] font-bold text-[#0066D2] mb-8"
            id="login-heading"
          >
            Sign In
          </h2>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-[14px] text-center font-medium">
                {error}
              </div>
            )}

            <FormField label="Email Address" icon={<Mail size={24} />}>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="pepito@gmail.com"
                required
                className="flex-1 h-full bg-transparent text-[20px] leading-[36px] text-[#1CA698] outline-none"
              />
            </FormField>

            <FormField label="Password" icon={<Lock size={24} />}>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="flex-1 h-full bg-transparent text-[20px] leading-[36px] text-[#1CA698] outline-none"
              />
            </FormField>

            <SubmitButton disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </SubmitButton>
          </form>

          <p className="mt-6 text-center text-[16px] text-[#171717]">
            New to TripSync?{' '}
            <Link
              to="/register"
              className="font-semibold text-[#1CA698] hover:underline"
              id="login-register-link"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
