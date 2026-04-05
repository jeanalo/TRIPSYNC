import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { useTravel } from '../../context/TravelContext';
import FormField from '../../components/ui/FormField';
import SubmitButton from '../../components/ui/SubmitButton';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useTravel();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(email);
    navigate('/app');
  };

  return (
    <div className="flex h-screen w-screen" id="login-page">
      {/* Left brand panel */}
      <div className="hidden md:block w-1/2 h-full">
        <img
          src="/banner-tripsync.svg"
          alt="TripSync Banner"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right form panel */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-white px-6">
        <div className="w-full max-w-[400px]">
          {/* Heading */}
          <h2
            className="text-center text-[36px] md:text-[48px] font-bold text-[#0066D2] mb-8"
            id="login-heading"
          >
            Sign In
          </h2>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            {/* Email Address */}
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

            {/* Password */}
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

            <SubmitButton>Sign In</SubmitButton>
          </form>

          {/* Footer link */}
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
