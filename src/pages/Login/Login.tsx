import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTravel } from '../../context/TravelContext';

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
    <div style={{ maxWidth: '400px', margin: '80px auto', padding: '24px' }}>
      <h1>Welcome Back</h1>
      <p>Your journey continues here</p>

      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '16px' }}>
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="traveler@example.com"
            required
            style={{ display: 'block', width: '100%', padding: '8px', marginTop: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            style={{ display: 'block', width: '100%', padding: '8px', marginTop: '4px' }}
          />
        </div>

        <button
          type="submit"
          style={{ width: '100%', padding: '12px', cursor: 'pointer' }}
        >
          Sign In
        </button>
      </form>

      <p style={{ marginTop: '16px', textAlign: 'center' }}>
        New to TripSync? <Link to="/register">Create an account</Link>
      </p>
    </div>
  );
};

export default Login;
