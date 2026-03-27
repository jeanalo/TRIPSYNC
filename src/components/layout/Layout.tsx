import { Outlet, Link } from 'react-router-dom';
import { useTravel } from '../../context/TravelContext';

const Layout = () => {
  const { user } = useTravel();

  return (
    <div>
      <nav
        style={{
          display: 'flex',
          gap: '16px',
          padding: '16px',
          borderBottom: '1px solid #5b8a6a',
        }}
      >
        <Link to="/app">Dashboard</Link>
        <Link to="/app/setup">Trip Setup</Link>
        <Link to="/app/jet-lag">Jet Lag</Link>
        <Link to="/app/budget">Budget</Link>
        <Link to="/app/schedule">Schedule</Link>
        <Link to="/app/experiences">Experiences</Link>
        <Link to="/app/profile">Profile</Link>
        <span style={{ marginLeft: 'auto' }}>{user?.name || 'Traveler'}</span>
      </nav>

      <main style={{ padding: '24px' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
