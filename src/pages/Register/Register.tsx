import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plane, Lock, Mail, User } from 'lucide-react';
import { useTravel } from '../../context/TravelContext';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useTravel();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    login(email);
    navigate('/app');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-foreground font-sans">
      <div className="w-full max-w-md bg-card rounded-3xl shadow-2xl overflow-hidden border border-border/10">
        <div className="bg-gradient-to-br from-primary to-secondary p-6 md:p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]"></div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-md shadow-lg border border-white/30">
              <Plane className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
              Join the Adventure
            </h1>
            <p className="text-white/80 font-medium">Create your travel profile</p>
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-card-foreground/70 ml-1"
              >
                Full Name
              </label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary">
                  <User className="w-5 h-5" />
                </div>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Traveler"
                  className="w-full pl-10 pr-4 py-3 bg-input rounded-xl border border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground placeholder:text-muted-foreground/50"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-card-foreground/70 ml-1"
              >
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="traveler@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-input rounded-xl border border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground placeholder:text-muted-foreground/50"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-card-foreground/70 ml-1"
              >
                Password
              </label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-input rounded-xl border border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground placeholder:text-muted-foreground/50"
                  required
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <input
                type="checkbox"
                id="terms"
                className="rounded border-gray-300 text-primary focus:ring-primary"
                required
              />
              <label
                htmlFor="terms"
                className="text-sm text-card-foreground/70 cursor-pointer"
              >
                I agree to the{' '}
                <a href="#" className="text-primary hover:underline">
                  Terms & Privacy Policy
                </a>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg hover:bg-primary/90 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 active:translate-y-0 active:shadow-md"
            >
              Sign Up
            </button>
          </form>

          <div className="pt-4 text-center">
            <p className="text-sm text-card-foreground/60">
              Already have an account?{' '}
              <Link
                to="/"
                className="font-semibold text-primary hover:text-primary/80 transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>

      <p className="mt-8 text-xs text-foreground/30 font-medium tracking-wide">
        START YOUR JOURNEY TODAY
      </p>
    </div>
  );
}
