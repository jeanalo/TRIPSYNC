import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthProvider';
import FormField from '../../components/FormField/FormField';
import SubmitButton from '../../components/SubmitButton/SubmitButton';
import AuthForm from '../../components/AuthForm/AuthForm';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await register(email, name, password);
      navigate('/login');
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'Failed to create account. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthForm
      id="register-page"
      heading="Sign Up"
      headingId="register-heading"
      onSubmit={handleRegister}
      error={error}
      footer={
        <>
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-[#1CA698] hover:underline"
            id="register-login-link"
          >
            Sign In
          </Link>
        </>
      }
    >
      <FormField label="Full Name" icon={<User size={24} />}>
        <input
          id="register-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Pepito Pérez"
          required
          className="flex-1 h-full bg-transparent text-[20px] leading-[36px] text-[#1CA698] outline-none"
        />
      </FormField>

      <FormField label="Email Address" icon={<Mail size={24} />}>
        <input
          id="register-email"
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
          id="register-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          className="flex-1 h-full bg-transparent text-[20px] leading-[36px] text-[#1CA698] outline-none"
        />
      </FormField>

      <SubmitButton disabled={isLoading}>
        {isLoading ? 'Creating Account...' : 'Sign Up'}
      </SubmitButton>
    </AuthForm>
  );
};

export default Register;
