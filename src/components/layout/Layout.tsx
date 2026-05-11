import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { useTravel } from '../../providers/TravelProvider';
import { useAuth } from '../../providers/AuthProvider';
import { useRealtime } from '../../providers/RealtimeProvider';
import {
  LayoutDashboard,
  Plane,
  Moon,
  PieChart,
  CalendarDays,
  Map,
  User,
  Menu,
  X,
  MapPin
} from 'lucide-react';
import IconBadge from '../IconBadge/IconBadge';
import RealtimeRecommendationToast from '../RealtimeRecommendationToast/RealtimeRecommendationToast';

const navItems = [
  { to: '/app', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/app/setup', label: 'Trip Setup', icon: Plane },
  { to: '/app/jet-lag', label: 'Jet Lag Assistant', icon: Moon },
  { to: '/app/budget', label: 'Budget Tracker', icon: PieChart },
  { to: '/app/schedule', label: 'Schedule', icon: CalendarDays },
  { to: '/app/experiences', label: 'Experiences', icon: Map },
  { to: '/app/profile', label: 'Profile', icon: User },
];

const Layout = () => {
  const { user, loading } = useAuth();
  const { activeCity, setActiveCity } = useTravel();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  const { latestNotification, clearNotification } = useRealtime();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col lg:flex-row bg-white">
      <div className="flex lg:hidden items-center justify-between p-4 bg-white border-b border-[#e0e0e0] sticky top-0 z-30">
        <button onClick={() => setIsMobileMenuOpen(true)}>
          <Menu size={28} className="text-[#0066D2]" />
        </button>
        <Link to="/app" className="flex items-center no-underline">
          <img src="/logo.png" alt="TripSync logo" className="h-8" />
        </Link>
      </div>

      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside className={`fixed left-0 top-0 z-50 flex h-screen w-[280px] flex-col border-r border-[#e0e0e0] bg-white transition-transform duration-300 lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <button 
          className="lg:hidden absolute top-4 right-4 text-[#0066D2] p-2"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <X size={24} />
        </button>

        <div className="px-10 pt-9 pb-6 hidden lg:block">
          <Link to="/app" className="flex items-center no-underline">
            <img src="/logo.png" alt="TripSync logo" />
          </Link>
        </div>
        <div className="px-10 pt-12 pb-6 lg:hidden">
          <img src="/logo.png" alt="TripSync logo" className="h-8" />
        </div>

        <div className="px-10 py-4 mb-4 border-y border-[#e0e0e0] bg-[#F5F7FA]/30">
          <label className="text-[10px] font-bold text-[#999] uppercase tracking-[0.05em] mb-2 block">
            Active City
          </label>
          <div className="relative">
            <select
              value={activeCity}
              onChange={(e) => setActiveCity(e.target.value)}
              className="w-full bg-white border border-[#e0e0e0] rounded-lg px-3 py-2 text-[13px] text-[#0066D2] font-semibold outline-none focus:border-[#1CA698] transition-all appearance-none cursor-pointer hover:border-[#1CA698]/50"
            >
              <option value="tokyo">Tokyo</option>
              <option value="paris">Paris</option>
              <option value="london">London</option>
              <option value="madrid">Madrid</option>
              <option value="cali">Cali</option>
              <option value="rio">Rio de Janeiro</option>
              <option value="bali">Bali</option>
              <option value="new-york">New York</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#1CA698]">
              <MapPin size={14} />
            </div>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-[30px] px-10">
          {navItems.map((item) => {
            const isActive =
              item.to === '/app'
                ? location.pathname === '/app'
                : location.pathname.startsWith(item.to);
            const Icon = item.icon;

            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 text-[18px] font-medium no-underline transition-colors duration-200 ${
                  isActive
                    ? 'text-[#1CA698]'
                    : 'text-[#0066D2] hover:text-[#1CA698]'
                }`}
              >
                <Icon size={24} strokeWidth={2} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mx-0 border-t border-[#e0e0e0]" />

        <div className="flex items-center gap-3 px-10 py-6">
          <IconBadge color="primary" size="md">
            <User size={24} />
          </IconBadge>
          <div className="flex flex-col">
            <span className="text-[16px] font-medium leading-5 text-[#0066D2]">
              {user?.name || 'Pepito Pérez'}
            </span>
            <span className="text-[12px] leading-4 text-[#0066D2]">
              {user?.email || 'pepito@gmail.com'}
            </span>
          </div>
        </div>
      </aside>

      <main className="lg:ml-[280px] flex-1 p-0 flex flex-col min-w-0">
        <Outlet />
      </main>

      <RealtimeRecommendationToast 
        notification={latestNotification} 
        onClose={clearNotification} 
      />
    </div>
  );
};

export default Layout;
