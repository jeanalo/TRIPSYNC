import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useTravel } from '../../context/TravelContext';
import {
  LayoutDashboard,
  Plane,
  Moon,
  PieChart,
  CalendarDays,
  Map,
  User,
  Menu,
  X
} from 'lucide-react';

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
  const { user } = useTravel();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col lg:flex-row bg-white">
      {/* Mobile Top Bar */}
      <div className="flex lg:hidden items-center justify-between p-4 bg-white border-b border-[#e0e0e0] sticky top-0 z-30">
        <button onClick={() => setIsMobileMenuOpen(true)}>
          <Menu size={28} className="text-[#0066D2]" />
        </button>
        <Link to="/app" className="flex items-center no-underline">
          <img src="/logo.png" alt="TripSync logo" className="h-8" />
        </Link>
      </div>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 z-50 flex h-screen w-[280px] flex-col border-r border-[#e0e0e0] bg-white transition-transform duration-300 lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Mobile close button */}
        <button 
          className="lg:hidden absolute top-4 right-4 text-[#0066D2] p-2"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <X size={24} />
        </button>

        {/* Logo */}
        <div className="px-10 pt-9 pb-6 hidden lg:block">
          <Link to="/app" className="flex items-center no-underline">
            <img src="/logo.png" alt="TripSync logo" />
          </Link>
        </div>
        <div className="px-10 pt-12 pb-6 lg:hidden">
          <img src="/logo.png" alt="TripSync logo" className="h-8" />
        </div>

        {/* Navigation */}
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

        {/* Separator */}
        <div className="mx-0 border-t border-[#e0e0e0]" />

        {/* User profile */}
        <div className="flex items-center gap-3 px-10 py-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-[15px] bg-[#1CA698]">
            <User size={24} className="text-white" />
          </div>
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

      {/* Main content */}
      <main className="lg:ml-[280px] flex-1 p-0 flex flex-col min-w-0">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
