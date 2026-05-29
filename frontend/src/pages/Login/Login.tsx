import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthProvider';
import FormField from '../../components/FormField/FormField';
import SubmitButton from '../../components/SubmitButton/SubmitButton';
import AuthForm from '../../components/AuthForm/AuthForm';

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
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
          : 'Login failed. Please check your credentials.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthForm
      id="login-page"
      heading="Sign In"
      headingId="login-heading"
      onSubmit={handleLogin}
      error={error}
      footer={
        <>
          New to TripSync?{' '}
          <Link
            to="/register"
            className="font-semibold text-[#1CA698] hover:underline"
            id="login-register-link"
          >
            Create an account
          </Link>
        </>
      }
    >
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
    </AuthForm>
  );
};

export default Login;
