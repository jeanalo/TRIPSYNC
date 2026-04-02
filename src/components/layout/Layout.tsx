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

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 flex h-screen w-[280px] flex-col border-r border-[#e0e0e0] bg-white">
        {/* Logo */}
        <div className="px-10 pt-9 pb-6">
          <Link to="/app" className="flex items-center no-underline">
            <img src="/logo.png" alt="TripSync logo" />
          </Link>
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
      <main className="ml-[280px] flex-1 p-0">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
